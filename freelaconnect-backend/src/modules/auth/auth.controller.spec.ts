import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { UserRole } from '../users/enums/user-role.enum';
import { UserStatus } from '../users/enums/user-status.enum';

describe('AuthController', () => {
  it('logs users in', async () => {
    const response = {
      accessToken: 'token',
      user: {
        userId: 1,
        name: 'Ana Admin',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        version: 1,
        createdAt: new Date('2026-06-01T00:00:00.000Z'),
        updatedAt: new Date('2026-06-01T00:00:00.000Z'),
        deletedAt: null,
      },
    };
    const authService = {
      login: jest.fn().mockResolvedValue(response),
    } as unknown as jest.Mocked<AuthService>;
    const controller = new AuthController(authService);

    await expect(
      controller.login({ email: 'admin@example.com', password: 'password123' }),
    ).resolves.toBe(response);
  });

  it('returns the current authenticated user', () => {
    const authService = { login: jest.fn() } as unknown as AuthService;
    const controller = new AuthController(authService);
    const currentUser = { userId: 1, email: 'admin@example.com', role: UserRole.ADMIN };

    expect(controller.getMe(currentUser)).toBe(currentUser);
  });
});
