import { IsNull, Repository } from 'typeorm';
import { UserVersionConflictException } from '../../../common/exceptions/user-version-conflict.exception';
import { UserEntity } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';
import { UserTypeOrmRepository } from './user-type-orm.repository';
import { USERS_REPOSITORY } from './users.repository.interface';

describe('UserTypeOrmRepository', () => {
  let typeOrmRepository: jest.Mocked<Repository<UserEntity>>;
  let repository: UserTypeOrmRepository;

  const createUser = (overrides: Partial<UserEntity> = {}): UserEntity =>
    Object.assign(new UserEntity(), {
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
      ...overrides,
    });

  beforeEach(() => {
    typeOrmRepository = {
      findOne: jest.fn(),
      findAndCount: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<Repository<UserEntity>>;

    repository = new UserTypeOrmRepository(typeOrmRepository);
  });

  it('defines the users repository injection token', () => {
    expect(USERS_REPOSITORY).toBe('USERS_REPOSITORY');
  });

  it('finds active users by id', async () => {
    const user = createUser();
    typeOrmRepository.findOne.mockResolvedValue(user);

    await expect(repository.findById(1)).resolves.toBe(user);
    expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
      where: { userId: 1, deletedAt: IsNull() },
    });
  });

  it('finds active users by email', async () => {
    const user = createUser();
    typeOrmRepository.findOne.mockResolvedValue(user);

    await expect(repository.findByEmail('ana@example.com')).resolves.toBe(user);
    expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
      where: { email: 'ana@example.com', deletedAt: IsNull() },
    });
  });

  it('lists users with pagination ignoring soft deleted records', async () => {
    const user = createUser();
    typeOrmRepository.findAndCount.mockResolvedValue([[user], 1]);

    await expect(repository.findAll(2, 5)).resolves.toEqual({
      data: [user],
      total: 1,
    });
    expect(typeOrmRepository.findAndCount).toHaveBeenCalledWith({
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
      take: 5,
      skip: 5,
    });
  });

  it('saves users', async () => {
    const user = createUser();
    typeOrmRepository.save.mockResolvedValue(user);

    await expect(repository.save(user)).resolves.toBe(user);
    expect(typeOrmRepository.save).toHaveBeenCalledWith(user);
  });

  it('updates users and increments version when client version matches', async () => {
    const user = createUser();
    const updatedUser = createUser({ name: 'Ana Atualizada', version: 2 });

    typeOrmRepository.findOne
      .mockResolvedValueOnce(user)
      .mockResolvedValueOnce(updatedUser);
    typeOrmRepository.update.mockResolvedValue({ affected: 1 } as any);

    await expect(
      repository.update(1, { name: 'Ana Atualizada', version: 1 }),
    ).resolves.toBe(updatedUser);
    expect(typeOrmRepository.update).toHaveBeenCalledWith(
      { userId: 1 },
      expect.objectContaining({ name: 'Ana Atualizada', version: 2 }),
    );
  });

  it('throws conflict when update client version is stale', async () => {
    const user = createUser({ version: 2 });
    typeOrmRepository.findOne.mockResolvedValue(user);

    await expect(
      repository.update(1, { name: 'Ana', version: 1 }),
    ).rejects.toThrow(UserVersionConflictException);
    expect(typeOrmRepository.update).not.toHaveBeenCalled();
  });

  it('soft deletes users when version matches', async () => {
    const user = createUser();
    typeOrmRepository.findOne.mockResolvedValue(user);
    typeOrmRepository.save.mockResolvedValue(user);

    await expect(repository.delete(1, 1)).resolves.toBe(true);
    expect(typeOrmRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ deletedAt: expect.any(Date) }),
    );
  });
});
