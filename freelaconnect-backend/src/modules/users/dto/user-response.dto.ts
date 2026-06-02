import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';

export class UserResponseDto {
  userId: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  version: number;
  createdAt: Date;
  updatedAt: Date;
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
