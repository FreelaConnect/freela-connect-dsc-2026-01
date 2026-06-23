import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { PasswordRecoveryResponseDto } from './dto/password-recovery-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './services/auth.service';
import { AuthenticatedUser } from './types/authenticated-user';
import { UserResponseDto } from '../users/dto/user-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Autentica um usuario e retorna um token JWT' })
  @ApiOkResponse({ description: 'Login realizado com sucesso.', type: AuthResponseDto })
  @ApiUnauthorizedResponse({ description: 'Credenciais invalidas.' })
  @HttpCode(HttpStatus.OK)
  async login(@Body(ValidationPipe) loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna o usuario autenticado pelo token JWT' })
  @ApiOkResponse({ description: 'Usuario autenticado.', type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido.' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  getMe(@CurrentUser() currentUser: AuthenticatedUser): Promise<UserResponseDto> {
    return this.authService.getCurrentUser(currentUser.userId);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Solicita instrucoes para recuperacao de senha' })
  @ApiOkResponse({
    description: 'Solicitacao de recuperacao recebida.',
    type: PasswordRecoveryResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  forgotPassword(
    @Body(ValidationPipe) forgotPasswordDto: ForgotPasswordDto,
  ): Promise<PasswordRecoveryResponseDto> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Redefine a senha usando um token de recuperacao' })
  @ApiOkResponse({ description: 'Senha redefinida com sucesso.' })
  @HttpCode(HttpStatus.OK)
  resetPassword(
    @Body(ValidationPipe) resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
