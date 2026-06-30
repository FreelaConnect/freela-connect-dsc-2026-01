import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Ana Souza' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'ana.souza@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'senha1234', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.USER })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
