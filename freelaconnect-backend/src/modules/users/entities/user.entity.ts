import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId!: number;

  @Column({ name: 'name' })
  name!: string;

  @Column({ name: 'email', unique: true })
  email!: string;

  @Column({ name: 'password_hash' })
  passwordHash!: string;

  @Column({ name: 'password_reset_token_hash', nullable: true })
  passwordResetTokenHash: string | null = null;

  @Column({ name: 'password_reset_token_expires_at', type: 'timestamp', nullable: true })
  passwordResetTokenExpiresAt: Date | null = null;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole = UserRole.USER;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus = UserStatus.ACTIVE;

  @Column({ name: 'version', type: 'int', default: 1 })
  version: number = 1;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null = null;
}
