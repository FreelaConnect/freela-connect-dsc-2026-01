import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';

export class ReplaceUserDto {
  @IsNumber()
  @IsNotEmpty()
  version!: number;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role!: UserRole;

  @IsEnum(UserStatus)
  @IsNotEmpty()
  status!: UserStatus;
}
