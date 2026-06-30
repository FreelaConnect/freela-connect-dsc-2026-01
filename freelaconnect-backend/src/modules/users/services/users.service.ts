import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { PaginatedUserResponseDto } from '../dto/paginated-user-response.dto';
import { ReplaceUserDto } from '../dto/replace-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserEntity } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum';
import { USERS_REPOSITORY } from '../repositories/users.repository.interface';
import type { UsersRepository } from '../repositories/users.repository.interface';
import { PasswordService } from './password.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException(
        `Usuario com email ${createUserDto.email} ja existe`,
      );
    }

    const user = new UserEntity();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.passwordHash = await this.passwordService.hashPassword(
      createUserDto.password,
    );
    user.role = createUserDto.role || UserRole.USER;

    const savedUser = await this.usersRepository.save(user);
    return this.toResponseDto(savedUser);
  }

  async getAllUsers(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedUserResponseDto> {
    const { data, total } = await this.usersRepository.findAll(page, limit);

    return new PaginatedUserResponseDto({
      data: data.map((user) => this.toResponseDto(user)),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  }

  async getById(userId: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`Usuario com ID ${userId} nao encontrado`);
    }

    return this.toResponseDto(user);
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`Usuario com ID ${userId} nao encontrado`);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const userWithEmail = await this.usersRepository.findByEmail(
        updateUserDto.email,
      );
      if (userWithEmail && userWithEmail.userId !== userId) {
        throw new ConflictException(
          `Usuario com email ${updateUserDto.email} ja existe`,
        );
      }
    }

    const updateData: Partial<UserEntity> = { ...updateUserDto };
    if (updateUserDto.password) {
      updateData.passwordHash = await this.passwordService.hashPassword(
        updateUserDto.password,
      );
    }
    delete (updateData as { password?: string }).password;

    const updatedUser = await this.usersRepository.update(userId, updateData);
    if (!updatedUser) {
      throw new NotFoundException(
        `Falha ao atualizar usuario com ID ${userId}`,
      );
    }

    return this.toResponseDto(updatedUser);
  }

  async replaceUser(
    userId: number,
    replaceUserDto: ReplaceUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`Usuario com ID ${userId} nao encontrado`);
    }

    if (replaceUserDto.email !== user.email) {
      const userWithEmail = await this.usersRepository.findByEmail(
        replaceUserDto.email,
      );
      if (userWithEmail && userWithEmail.userId !== userId) {
        throw new ConflictException(
          `Usuario com email ${replaceUserDto.email} ja existe`,
        );
      }
    }

    const replacedUser = await this.usersRepository.update(userId, {
      name: replaceUserDto.name,
      email: replaceUserDto.email,
      passwordHash: await this.passwordService.hashPassword(
        replaceUserDto.password,
      ),
      role: replaceUserDto.role,
      status: replaceUserDto.status,
      version: replaceUserDto.version,
    });
    if (!replacedUser) {
      throw new NotFoundException(
        `Falha ao substituir usuario com ID ${userId}`,
      );
    }

    return this.toResponseDto(replacedUser);
  }

  async deleteUser(
    userId: number,
    version?: number,
  ): Promise<{ message: string }> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`Usuario com ID ${userId} nao encontrado`);
    }

    const deleted = await this.usersRepository.delete(userId, version);
    if (!deleted) {
      throw new NotFoundException(`Falha ao deletar usuario com ID ${userId}`);
    }

    return { message: `Usuario ${userId} deletado com sucesso` };
  }

  private toResponseDto(user: UserEntity): UserResponseDto {
    return new UserResponseDto({
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    });
  }
}
