import { PaymentEntity } from "../entities/payment.entity";

export const PAYMENTS_REPOSITORY = 'PAYMENTS_REPOSITORY';

export interface PaymentsRepository {
    findByOrderId(orderId: string): Promise<PaymentEntity | null>;
}
