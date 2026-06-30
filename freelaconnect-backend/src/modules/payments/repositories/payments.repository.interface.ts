import { PaymentEntity } from '../entities/payment.entity';

export const PAYMENTS_REPOSITORY = 'PAYMENTS_REPOSITORY';

export interface PaymentsRepository {
  findById(paymentId: string): Promise<PaymentEntity | null>;
  findByOrderId(orderId: string): Promise<PaymentEntity | null>;
  findAll(
    page?: number,
    limit?: number,
  ): Promise<{ data: PaymentEntity[]; total: number }>;
  save(payment: PaymentEntity): Promise<PaymentEntity>;
  update(
    paymentId: string,
    payment: Partial<PaymentEntity>,
  ): Promise<PaymentEntity | null>;
  delete(paymentId: string, version?: number): Promise<boolean>;
}
