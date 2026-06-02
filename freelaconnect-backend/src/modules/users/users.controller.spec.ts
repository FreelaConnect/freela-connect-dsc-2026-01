import { UsersController } from './users.controller';
import { UsersService } from './services/users.service';
import { UserRole } from './enums/user-role.enum';
import { UserStatus } from './enums/user-status.enum';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  const userResponse = {
    userId: 1,
    name: 'Ana Cliente',
    email: 'ana@example.com',
    role: UserRole.CLIENT,
    status: UserStatus.ACTIVE,
    version: 1,
    createdAt: new Date('2026-06-01T00:00:00.000Z'),
    updatedAt: new Date('2026-06-01T00:00:00.000Z'),
    deletedAt: null,
  };

  beforeEach(() => {
    service = {
      createUser: jest.fn(),
      getAllUsers: jest.fn(),
      getById: jest.fn(),
      updateUser: jest.fn(),
      replaceUser: jest.fn(),
      deleteUser: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    controller = new UsersController(service);
  });

  it('creates users', async () => {
    service.createUser.mockResolvedValue(userResponse);

    await expect(
      controller.createUser({
        name: 'Ana Cliente',
        email: 'ana@example.com',
        password: 'password123',
      }),
    ).resolves.toBe(userResponse);
  });

  it('lists users with parsed pagination defaults', async () => {
    const paginated = {
      data: [userResponse],
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    };
    service.getAllUsers.mockResolvedValue(paginated);

    await expect(controller.getAllUsers({})).resolves.toBe(paginated);
    expect(service.getAllUsers).toHaveBeenCalledWith(1, 10);
  });

  it('gets users by id', async () => {
    service.getById.mockResolvedValue(userResponse);

    await expect(controller.getById('1')).resolves.toBe(userResponse);
    expect(service.getById).toHaveBeenCalledWith(1);
  });

  it('updates users', async () => {
    service.updateUser.mockResolvedValue({ ...userResponse, name: 'Ana Atualizada', version: 2 });

    await expect(controller.updateUser('1', { name: 'Ana Atualizada', version: 1 })).resolves.toMatchObject({
      name: 'Ana Atualizada',
      version: 2,
    });
  });

  it('replaces users', async () => {
    service.replaceUser.mockResolvedValue({ ...userResponse, role: UserRole.ADMIN, version: 2 });

    await expect(
      controller.replaceUser('1', {
        name: 'Ana Admin',
        email: 'ana.admin@example.com',
        password: 'password123',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        version: 1,
      }),
    ).resolves.toMatchObject({
      role: UserRole.ADMIN,
      version: 2,
    });
  });

  it('deletes users', async () => {
    service.deleteUser.mockResolvedValue({ message: 'Usuario 1 deletado com sucesso' });

    await expect(controller.deleteUser('1', { version: 1 })).resolves.toEqual({
      message: 'Usuario 1 deletado com sucesso',
    });
  });
});
