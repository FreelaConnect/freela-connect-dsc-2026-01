import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { UserEntity } from '../../users/entities/user.entity';
import { UserStatus } from '../../users/enums/user-status.enum';
import { USERS_REPOSITORY } from '../../users/repositories/users.repository.interface';
import type { UsersRepository } from '../../users/repositories/users.repository.interface';
import { PasswordService } from '../../users/services/password.service';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersRepository.findByEmail(loginDto.email);
    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Credenciais invalidas');
    }

    const passwordMatches = await this.passwordService.comparePassword(
      loginDto.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciais invalidas');
    }

    return new AuthResponseDto({
      accessToken: this.jwtService.sign({
        sub: user.userId,
        email: user.email,
        role: user.role,
      }),
      user: this.toResponseDto(user),
    });
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
