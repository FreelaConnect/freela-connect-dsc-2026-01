import { UserEntity } from '../entities/user.entity';

export const USERS_REPOSITORY = 'USERS_REPOSITORY';

export interface UsersRepository {
  findById(userId: number): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findAll(page?: number, limit?: number): Promise<{ data: UserEntity[]; total: number }>;
  save(user: UserEntity): Promise<UserEntity>;
  update(userId: number, user: Partial<UserEntity>): Promise<UserEntity | null>;
  delete(userId: number, version?: number): Promise<boolean>;
}
