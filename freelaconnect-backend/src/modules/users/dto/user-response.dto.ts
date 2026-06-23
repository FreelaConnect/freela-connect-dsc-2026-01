import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  userId: number;
  @ApiProperty({ example: 'Ana Souza' })
  name: string;
  @ApiProperty({ example: 'ana.souza@example.com' })
  email: string;
  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  role: UserRole;
  @ApiProperty({ enum: UserStatus, example: UserStatus.ACTIVE })
  status: UserStatus;
  @ApiProperty({ example: 1 })
  version: number;
  @ApiProperty({ example: '2026-06-09T12:00:00.000Z' })
  createdAt: Date;
  @ApiProperty({ example: '2026-06-09T12:00:00.000Z' })
  updatedAt: Date;
  @ApiProperty({ example: null, nullable: true, type: String })
  deletedAt: Date | null;

  constructor(data: {
    userId: number;
    name: string;
    email: string;
    passwordHash?: string;
    role: UserRole;
    status: UserStatus;
    version: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }) {
    this.userId = data.userId;
    this.name = data.name;
    this.email = data.email;
    this.role = data.role;
    this.status = data.status;
    this.version = data.version;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
  }
}
