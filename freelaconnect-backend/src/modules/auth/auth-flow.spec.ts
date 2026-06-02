import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtService } from './services/jwt.service';
import { PasswordService } from '../users/services/password.service';
import { UsersService } from '../users/services/users.service';
import { USERS_REPOSITORY, UsersRepository } from '../users/repositories/users.repository.interface';
import { UserEntity } from '../users/entities/user.entity';
import { UserRole } from '../users/enums/user-role.enum';
import { UserStatus } from '../users/enums/user-status.enum';
import { AuthenticatedUser } from './types/authenticated-user';

describe('Users/Auth flow', () => {
  it('creates a user, logs in, validates token and exposes the current user', async () => {
    let idSequence = 1;
    const users = new Map<number, UserEntity>();
    const repository: UsersRepository = {
      findById: async (userId) => users.get(userId) ?? null,
      findByEmail: async (email) =>
        Array.from(users.values()).find((user) => user.email === email && !user.deletedAt) ?? null,
      findAll: async () => ({ data: Array.from(users.values()), total: users.size }),
      save: async (user) => {
        user.userId = idSequence++;
        user.createdAt = new Date('2026-06-01T00:00:00.000Z');
        user.updatedAt = new Date('2026-06-01T00:00:00.000Z');
        users.set(user.userId, user);
        return user;
      },
      update: async (userId, data) => {
        const user = users.get(userId);
        if (!user) return null;
        Object.assign(user, data);
        user.version += 1;
        return user;
      },
      delete: async (userId) => {
        const user = users.get(userId);
        if (!user) return false;
        user.deletedAt = new Date();
        return true;
      },
    };

    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        UsersService,
        AuthService,
        PasswordService,
        JwtAuthGuard,
        { provide: JwtService, useValue: new JwtService('test-secret', 3600) },
        { provide: USERS_REPOSITORY, useValue: repository },
      ],
    }).compile();

    const usersService = module.get(UsersService);
    const authController = module.get(AuthController);
    const guard = module.get(JwtAuthGuard);

    const createdUser = await usersService.createUser({
      name: 'Ana Admin',
      email: 'admin@example.com',
      password: 'password123',
      role: UserRole.ADMIN,
    });

    expect(createdUser).toMatchObject({
      userId: 1,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    });
    expect(createdUser).not.toHaveProperty('passwordHash');

    const login = await authController.login({
      email: 'admin@example.com',
      password: 'password123',
    });
    const request: { headers: { authorization: string }; user?: Record<string, unknown> } = {
      headers: { authorization: `Bearer ${login.accessToken}` },
    };
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
    } as any;

    expect(guard.canActivate(context)).toBe(true);
    expect(authController.getMe(request.user as AuthenticatedUser)).toMatchObject({
      userId: 1,
      email: 'admin@example.com',
      role: UserRole.ADMIN,
    });
  });
});
