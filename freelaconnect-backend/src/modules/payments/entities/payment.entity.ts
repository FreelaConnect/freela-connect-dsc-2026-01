import { PaymentStatusEnum } from '../../../common/enums/payment-status.enuns';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payments')
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'payment_id' })
  paymentId!: string;

  @Column({ name: 'ordem_id' })
  ordemId!: string;

  @Column({
    type: 'enum',
    enum: PaymentStatusEnum,
    default: PaymentStatusEnum.PENDING,
  })
  status: PaymentStatusEnum = PaymentStatusEnum.PENDING;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount!: number;

  @Column({ name: 'paid_at', type: 'timestamp', nullable: true })
  paidAt: Date | null = null;

  @Column({ name: 'version', type: 'int', default: 1 })
  version: number = 1;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null = null;

  constructor() {}
}
