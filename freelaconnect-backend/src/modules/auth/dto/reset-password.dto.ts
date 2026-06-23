import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: '5e9d1c...' })
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty({ example: 'novaSenha123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;
}
