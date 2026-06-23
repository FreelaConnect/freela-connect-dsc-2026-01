import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';

export class ReplaceUserDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  version!: number;

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

  @ApiProperty({ enum: UserRole, example: UserRole.CLIENT })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role!: UserRole;

  @ApiProperty({ enum: UserStatus, example: UserStatus.ACTIVE })
  @IsEnum(UserStatus)
  @IsNotEmpty()
  status!: UserStatus;
}
