import { PaymentStatusEnum } from '../../../common/enums/payment-status.enuns';
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('contracts')
export class ContractEntity {
  @PrimaryGeneratedColumn({ name: 'contract_id' })
  contractId!: number;

  @Column({ name: 'freelancer_id' })
  freelancerId!: string;

  @Column({ name: 'order_id' })
  orderId!: string;

  @Column({ name: 'project_id' })
  projectId!: string;

  @Column({
    type: 'enum',
    enum: PaymentStatusEnum,
    default: PaymentStatusEnum.PENDING,
  })
  status: PaymentStatusEnum = PaymentStatusEnum.PENDING;

  @Column({ name: 'version', type: 'int', default: 1 })
  version: number = 1;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null = null;

  constructor() {}
}
