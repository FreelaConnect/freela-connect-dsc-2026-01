import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PasswordRecoveryResponseDto {
  @ApiProperty({
    example:
      'Se o e-mail estiver cadastrado, enviaremos as instrucoes de recuperacao.',
  })
  message: string;

  @ApiPropertyOptional({
    example: '5e9d1c...',
    description: 'Token retornado apenas em ambiente de desenvolvimento.',
  })
  resetToken?: string;

  constructor(message: string, resetToken?: string) {
    this.message = message;
    this.resetToken = resetToken;
  }
}
