import { PaymentStatusEnum } from '../../../common/enums/payment-status.enuns';

export class ContractResponseDto {
    contractId: number;
    freelancerId: string;
    orderId: string;
    projectId: string;
    status: PaymentStatusEnum;
    version: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;

    constructor(data: {
        contractId: number;
        freelancerId: string;
        orderId: string;
        projectId: string;
        status: PaymentStatusEnum;
        version: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }) {
        this.contractId = data.contractId;
        this.freelancerId = data.freelancerId;
        this.orderId = data.orderId;
        this.projectId = data.projectId;
        this.status = data.status;
        this.version = data.version;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.deletedAt = data.deletedAt;
    }
}
