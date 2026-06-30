import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { UserEntity } from '../../users/entities/user.entity';
import { UserStatus } from '../../users/enums/user-status.enum';
import { USERS_REPOSITORY } from '../../users/repositories/users.repository.interface';
import type { UsersRepository } from '../../users/repositories/users.repository.interface';
import { PasswordService } from '../../users/services/password.service';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { LoginDto } from '../dto/login.dto';
import { PasswordRecoveryResponseDto } from '../dto/password-recovery-response.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { JwtService } from './jwt.service';

const PASSWORD_RECOVERY_MESSAGE =
  'Se o e-mail estiver cadastrado, enviaremos as instrucoes de recuperacao.';
const PASSWORD_RESET_TOKEN_TTL_MS = 1000 * 60 * 30;

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

  async getCurrentUser(userId: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(userId);
    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Token invalido');
    }

    return this.toResponseDto(user);
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<PasswordRecoveryResponseDto> {
    const user = await this.usersRepository.findByEmail(
      forgotPasswordDto.email,
    );
    if (!user || user.status !== UserStatus.ACTIVE) {
      return new PasswordRecoveryResponseDto(PASSWORD_RECOVERY_MESSAGE);
    }

    const resetToken = randomBytes(32).toString('hex');
    await this.usersRepository.update(user.userId, {
      passwordResetTokenHash: this.hashResetToken(resetToken),
      passwordResetTokenExpiresAt: new Date(
        Date.now() + PASSWORD_RESET_TOKEN_TTL_MS,
      ),
    });

    return new PasswordRecoveryResponseDto(
      PASSWORD_RECOVERY_MESSAGE,
      process.env.NODE_ENV === 'production' ? undefined : resetToken,
    );
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.usersRepository.findByPasswordResetTokenHash(
      this.hashResetToken(resetPasswordDto.token),
    );

    if (
      !user ||
      !user.passwordResetTokenExpiresAt ||
      user.passwordResetTokenExpiresAt.getTime() < Date.now()
    ) {
      throw new BadRequestException(
        'Token de recuperacao invalido ou expirado',
      );
    }

    await this.usersRepository.update(user.userId, {
      passwordHash: await this.passwordService.hashPassword(
        resetPasswordDto.password,
      ),
      passwordResetTokenHash: null,
      passwordResetTokenExpiresAt: null,
    });

    return { message: 'Senha redefinida com sucesso.' };
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

  private hashResetToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
