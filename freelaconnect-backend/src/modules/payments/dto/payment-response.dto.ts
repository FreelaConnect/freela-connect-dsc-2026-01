import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatusEnum } from '../../../common/enums/payment-status.enuns';

export class PaymentResponseDto {
  @ApiProperty({ example: 'payment-123' })
  paymentId: string;
  @ApiProperty({ example: 'order-123' })
  ordemId: string;
  @ApiProperty({ enum: PaymentStatusEnum, example: PaymentStatusEnum.PENDING })
  status: PaymentStatusEnum;
  @ApiProperty({ example: 1500 })
  amount: number;
  @ApiProperty({ example: null, nullable: true, type: String })
  paidAt: Date | null;
  @ApiProperty({ example: 1 })
  version: number;
  @ApiProperty({ example: '2026-06-09T12:00:00.000Z' })
  createdAt: Date;
  @ApiProperty({ example: '2026-06-09T12:00:00.000Z' })
  updatedAt: Date;
  @ApiProperty({ example: null, nullable: true, type: String })
  deletedAt: Date | null;

  constructor(data: {
    paymentId: string;
    ordemId: string;
    status: PaymentStatusEnum;
    amount: number;
    paidAt: Date | null;
    version: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }) {
    this.paymentId = data.paymentId;
    this.ordemId = data.ordemId;
    this.status = data.status;
    this.amount = data.amount;
    this.paidAt = data.paidAt;
    this.version = data.version;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
  }
}
