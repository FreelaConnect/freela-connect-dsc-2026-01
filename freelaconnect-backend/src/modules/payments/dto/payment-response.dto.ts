import { PaymentStatusEnum } from '../../../common/enums/payment-status.enuns';

export class PaymentResponseDto {
    paymentId: string;
    ordemId: string;
    status: PaymentStatusEnum;
    amount: number;
    paidAt: Date | null;
    version: number;
    createdAt: Date;
    updatedAt: Date;
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
