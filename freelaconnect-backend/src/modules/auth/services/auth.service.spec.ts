import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PasswordService } from '../../users/services/password.service';
import { USERS_REPOSITORY, UsersRepository } from '../../users/repositories/users.repository.interface';
import { UserEntity } from '../../users/entities/user.entity';
import { UserRole } from '../../users/enums/user-role.enum';
import { UserStatus } from '../../users/enums/user-status.enum';
import { AuthService } from './auth.service';
import { JwtService } from './jwt.service';

describe('AuthService', () => {
  let service: AuthService;
  let repository: jest.Mocked<UsersRepository>;
  let passwordService: jest.Mocked<PasswordService>;
  let jwtService: JwtService;

  const createUser = (overrides: Partial<UserEntity> = {}): UserEntity =>
    Object.assign(new UserEntity(), {
      userId: 1,
      name: 'Ana Admin',
      email: 'admin@example.com',
      passwordHash: 'hashed-password',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      version: 1,
      createdAt: new Date('2026-06-01T00:00:00.000Z'),
      updatedAt: new Date('2026-06-01T00:00:00.000Z'),
      deletedAt: null,
      ...overrides,
    });

  beforeEach(async () => {
    repository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    passwordService = {
      hashPassword: jest.fn(),
      comparePassword: jest.fn(),
    } as unknown as jest.Mocked<PasswordService>;
    jwtService = new JwtService('test-secret', 3600);

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: USERS_REPOSITORY, useValue: repository },
        { provide: PasswordService, useValue: passwordService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('logs in active users with valid credentials', async () => {
    repository.findByEmail.mockResolvedValue(createUser());
    passwordService.comparePassword.mockResolvedValue(true);

    const response = await service.login({
      email: 'admin@example.com',
      password: 'password123',
    });

    expect(response.accessToken).toBeDefined();
    expect(response.user).toMatchObject({
      userId: 1,
      email: 'admin@example.com',
      role: UserRole.ADMIN,
    });
    expect(response.user).not.toHaveProperty('passwordHash');
    expect(jwtService.verify(response.accessToken)).toMatchObject({
      sub: 1,
      email: 'admin@example.com',
      role: UserRole.ADMIN,
    });
  });

  it('rejects invalid credentials', async () => {
    repository.findByEmail.mockResolvedValue(createUser());
    passwordService.comparePassword.mockResolvedValue(false);

    await expect(
      service.login({ email: 'admin@example.com', password: 'wrong-password' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('rejects inactive users', async () => {
    repository.findByEmail.mockResolvedValue(createUser({ status: UserStatus.INACTIVE }));

    await expect(
      service.login({ email: 'admin@example.com', password: 'password123' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
