import { validate } from 'class-validator';
import { CreateUserDto } from './dto/create-user.dto';
import { ReplaceUserDto } from './dto/replace-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserEntity } from './entities/user.entity';
import { UserRole } from './enums/user-role.enum';
import { UserStatus } from './enums/user-status.enum';

describe('User model contracts', () => {
  it('defines the supported user roles', () => {
    expect(UserRole.ADMIN).toBe('ADMIN');
    expect(UserRole.CLIENT).toBe('CLIENT');
    expect(UserRole.FREELANCER).toBe('FREELANCER');
  });

  it('creates users with active status, client role and version one by default', () => {
    const user = new UserEntity();

    expect(user.role).toBe(UserRole.CLIENT);
    expect(user.status).toBe(UserStatus.ACTIVE);
    expect(user.version).toBe(1);
    expect(user.deletedAt).toBeNull();
  });

  it('validates create user dto fields', async () => {
    const dto = Object.assign(new CreateUserDto(), {
      name: '',
      email: 'invalid-email',
      password: '123',
      role: 'UNKNOWN',
    });

    const errors = await validate(dto);
    const invalidProperties = errors.map((error) => error.property);

    expect(invalidProperties).toEqual(
      expect.arrayContaining(['name', 'email', 'password', 'role']),
    );
  });

  it('requires version when updating or replacing a user', async () => {
    const updateErrors = await validate(new UpdateUserDto());
    const replaceErrors = await validate(new ReplaceUserDto());

    expect(updateErrors.map((error) => error.property)).toContain('version');
    expect(replaceErrors.map((error) => error.property)).toContain('version');
  });

  it('does not expose password hash in user responses', () => {
    const response = new UserResponseDto({
      userId: 1,
      name: 'Ana Cliente',
      email: 'ana@example.com',
      passwordHash: 'hashed-secret',
      role: UserRole.CLIENT,
      status: UserStatus.ACTIVE,
      version: 1,
      createdAt: new Date('2026-06-01T00:00:00.000Z'),
      updatedAt: new Date('2026-06-01T00:00:00.000Z'),
      deletedAt: null,
    });

    expect(response).not.toHaveProperty('passwordHash');
    expect(response).not.toHaveProperty('password');
    expect(response).toMatchObject({
      userId: 1,
      name: 'Ana Cliente',
      email: 'ana@example.com',
      role: UserRole.CLIENT,
      status: UserStatus.ACTIVE,
      version: 1,
    });
  });
});
