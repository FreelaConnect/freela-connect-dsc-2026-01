import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { USERS_REPOSITORY } from '../../src/modules/users/repositories/users.repository.interface';
import type { UsersRepository } from '../../src/modules/users/repositories/users.repository.interface';
import { UserEntity } from '../../src/modules/users/entities/user.entity';
import { UserRole } from '../../src/modules/users/enums/user-role.enum';
import { UserStatus } from '../../src/modules/users/enums/user-status.enum';
import { PasswordService } from '../../src/modules/users/services/password.service';
import { UsersService } from '../../src/modules/users/services/users.service';
import { AuthService } from '../../src/modules/auth/services/auth.service';
import { JwtService } from '../../src/modules/auth/services/jwt.service';
import {
  buildUserPayload,
  clearDatabase,
  createTestingModule,
} from '../helpers/test-app';

describe('Users/Auth integration', () => {
  let moduleRef: TestingModule;
  let usersService: UsersService;
  let authService: AuthService;
  let passwordService: PasswordService;
  let jwtService: JwtService;
  let usersRepository: UsersRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    moduleRef = await createTestingModule();
    usersService = moduleRef.get(UsersService, { strict: false });
    authService = moduleRef.get(AuthService, { strict: false });
    passwordService = moduleRef.get(PasswordService, { strict: false });
    jwtService = moduleRef.get(JwtService, { strict: false });
    usersRepository = moduleRef.get(USERS_REPOSITORY, { strict: false });
    dataSource = moduleRef.get(DataSource);
  });

  beforeEach(async () => {
    await clearDatabase(moduleRef);
  });

  afterAll(async () => {
    await moduleRef?.close();
  });

  it('UsersService cria usuario com senha hasheada', async () => {
    const payload = buildUserPayload();

    const created = await usersService.createUser(payload);
    const stored = await dataSource
      .getRepository(UserEntity)
      .findOneByOrFail({ userId: created.userId });

    expect(created.email).toBe(payload.email);
    expect(stored.passwordHash).not.toBe(payload.password);
    await expect(
      passwordService.comparePassword(payload.password, stored.passwordHash),
    ).resolves.toBe(true);
  });

  it('UsersService impede e-mail duplicado', async () => {
    const payload = buildUserPayload();
    await usersService.createUser(payload);

    await expect(usersService.createUser(payload)).rejects.toThrow(
      ConflictException,
    );
  });

  it('UsersService pagina usuarios', async () => {
    await usersService.createUser(buildUserPayload());
    await usersService.createUser(buildUserPayload());

    await expect(usersService.getAllUsers(1, 1)).resolves.toMatchObject({
      page: 1,
      limit: 1,
      total: 2,
      totalPages: 2,
      data: [expect.objectContaining({ userId: expect.any(Number) })],
    });
  });

  it('UsersService atualiza usuario', async () => {
    const created = await usersService.createUser(buildUserPayload());

    await expect(
      usersService.updateUser(created.userId, {
        version: created.version,
        name: 'Nome Integracao',
      }),
    ).resolves.toMatchObject({
      userId: created.userId,
      name: 'Nome Integracao',
      version: created.version + 1,
    });
  });

  it('UsersService remove usuario respeitando version', async () => {
    const created = await usersService.createUser(buildUserPayload());

    await expect(
      usersService.deleteUser(created.userId, created.version + 1),
    ).rejects.toThrow(ConflictException);
    await expect(
      usersService.deleteUser(created.userId, created.version),
    ).resolves.toEqual({
      message: `Usuario ${created.userId} deletado com sucesso`,
    });
  });

  it('AuthService login valido retorna accessToken', async () => {
    const payload = buildUserPayload({ role: UserRole.FREELANCER });
    const created = await usersService.createUser(payload);

    const response = await authService.login({
      email: payload.email,
      password: payload.password,
    });

    expect(response.accessToken).toEqual(expect.any(String));
    expect(response.user.userId).toBe(created.userId);
    expect(jwtService.verify(response.accessToken)).toMatchObject({
      sub: created.userId,
      email: payload.email,
      role: UserRole.FREELANCER,
    });
  });

  it('AuthService senha invalida retorna UnauthorizedException', async () => {
    const payload = buildUserPayload();
    await usersService.createUser(payload);

    await expect(
      authService.login({ email: payload.email, password: 'wrong-password' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('AuthService usuario inexistente retorna UnauthorizedException', async () => {
    await expect(
      authService.login({
        email: 'missing@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('AuthService rejeita usuario inativo', async () => {
    const payload = buildUserPayload();
    const created = await usersService.createUser(payload);
    const user = await usersRepository.findById(created.userId);
    await usersRepository.update(created.userId, {
      ...user,
      status: UserStatus.INACTIVE,
      version: created.version,
    });

    await expect(
      authService.login({ email: payload.email, password: payload.password }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
