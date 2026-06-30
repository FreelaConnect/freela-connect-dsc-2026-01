import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  USERS_REPOSITORY,
  UsersRepository,
} from '../repositories/users.repository.interface';
import { UserEntity } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';
import { PasswordService } from './password.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UsersRepository>;
  let passwordService: jest.Mocked<PasswordService>;

  const createUser = (overrides: Partial<UserEntity> = {}): UserEntity =>
    Object.assign(new UserEntity(), {
      userId: 1,
      name: 'Ana Cliente',
      email: 'ana@example.com',
      passwordHash: 'stored-password',
      role: UserRole.CLIENT,
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
      findByPasswordResetTokenHash: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    passwordService = {
      hashPassword: jest.fn(),
      comparePassword: jest.fn(),
    } as unknown as jest.Mocked<PasswordService>;

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USERS_REPOSITORY,
          useValue: repository,
        },
        {
          provide: PasswordService,
          useValue: passwordService,
        },
      ],
    }).compile();

    service = module.get(UsersService);
  });

  it('creates users and never exposes password hash', async () => {
    repository.findByEmail.mockResolvedValue(null);
    passwordService.hashPassword.mockResolvedValue('hashed-password123');
    repository.save.mockResolvedValue(
      createUser({ passwordHash: 'hashed-password123' }),
    );

    const response = await service.createUser({
      name: 'Ana Cliente',
      email: 'ana@example.com',
      password: 'password123',
      role: UserRole.CLIENT,
    });

    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Ana Cliente',
        email: 'ana@example.com',
        passwordHash: 'hashed-password123',
        role: UserRole.CLIENT,
      }),
    );
    expect(repository.save).not.toHaveBeenCalledWith(
      expect.objectContaining({ passwordHash: 'password123' }),
    );
    expect(response).not.toHaveProperty('password');
    expect(response).not.toHaveProperty('passwordHash');
  });

  it('throws conflict when creating a user with duplicated email', async () => {
    repository.findByEmail.mockResolvedValue(createUser());

    await expect(
      service.createUser({
        name: 'Ana Cliente',
        email: 'ana@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow(ConflictException);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('returns paginated users', async () => {
    repository.findAll.mockResolvedValue({ data: [createUser()], total: 1 });

    await expect(service.getAllUsers(1, 10)).resolves.toMatchObject({
      data: [expect.objectContaining({ userId: 1, email: 'ana@example.com' })],
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    });
  });

  it('throws not found when user does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.getById(99)).rejects.toThrow(NotFoundException);
  });

  it('updates users when they exist', async () => {
    repository.findById.mockResolvedValue(createUser());
    passwordService.hashPassword.mockResolvedValue('hashed-new-password');
    repository.update.mockResolvedValue(
      createUser({ name: 'Ana Atualizada', version: 2 }),
    );

    await expect(
      service.updateUser(1, {
        name: 'Ana Atualizada',
        password: 'new-password',
        version: 1,
      }),
    ).resolves.toMatchObject({
      name: 'Ana Atualizada',
      version: 2,
    });
    expect(repository.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ passwordHash: 'hashed-new-password' }),
    );
  });

  it('replaces users when they exist', async () => {
    repository.findById.mockResolvedValue(createUser());
    passwordService.hashPassword.mockResolvedValue('hashed-password123');
    repository.update.mockResolvedValue(
      createUser({
        name: 'Ana Admin',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        version: 2,
      }),
    );

    await expect(
      service.replaceUser(1, {
        name: 'Ana Admin',
        email: 'ana.admin@example.com',
        password: 'password123',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        version: 1,
      }),
    ).resolves.toMatchObject({
      name: 'Ana Admin',
      role: UserRole.ADMIN,
      version: 2,
    });
    expect(repository.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ passwordHash: 'hashed-password123' }),
    );
  });

  it('soft deletes users when they exist', async () => {
    repository.findById.mockResolvedValue(createUser());
    repository.delete.mockResolvedValue(true);

    await expect(service.deleteUser(1, 1)).resolves.toEqual({
      message: 'Usuario 1 deletado com sucesso',
    });
  });
});
