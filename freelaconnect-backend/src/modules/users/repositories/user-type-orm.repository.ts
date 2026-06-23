import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { UserVersionConflictException } from '../../../common/exceptions/user-version-conflict.exception';
import { UserEntity } from '../entities/user.entity';
import { UsersRepository } from './users.repository.interface';

@Injectable()
export class UserTypeOrmRepository implements UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findById(userId: number): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { userId, deletedAt: IsNull() },
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { email, deletedAt: IsNull() },
    });
  }

  async findByPasswordResetTokenHash(passwordResetTokenHash: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { passwordResetTokenHash, deletedAt: IsNull() },
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: UserEntity[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.userRepository.findAndCount({
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
      take: limit,
      skip,
    });

    return { data, total };
  }

  async save(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  async update(userId: number, userData: Partial<UserEntity>): Promise<UserEntity | null> {
    const user = await this.findById(userId);
    if (!user) {
      return null;
    }

    const clientVersion = userData.version;
    if (clientVersion !== undefined && clientVersion !== user.version) {
      throw new UserVersionConflictException(userId, clientVersion, user.version);
    }

    Object.assign(user, userData);
    user.version = user.version + 1;

    await this.userRepository.update({ userId }, user);
    return this.findById(userId);
  }

  async delete(userId: number, version?: number): Promise<boolean> {
    const user = await this.findById(userId);
    if (!user) {
      return false;
    }

    if (version !== undefined && version !== user.version) {
      throw new UserVersionConflictException(userId, version, user.version);
    }

    user.deletedAt = new Date();
    await this.userRepository.save(user);
    return true;
  }
}
