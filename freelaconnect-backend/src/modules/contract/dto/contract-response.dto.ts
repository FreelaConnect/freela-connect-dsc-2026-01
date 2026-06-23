import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatusEnum } from '../../../common/enums/payment-status.enuns';

export class ContractResponseDto {
    @ApiProperty({ example: 1 })
    contractId: number;
    @ApiProperty({ example: 'freelancer-123' })
    freelancerId: string;
    @ApiProperty({ example: 'order-123' })
    orderId: string;
    @ApiProperty({ example: 'project-123' })
    projectId: string;
    @ApiProperty({ enum: PaymentStatusEnum, example: PaymentStatusEnum.PENDING })
    status: PaymentStatusEnum;
    @ApiProperty({ example: 1 })
    version: number;
    @ApiProperty({ example: '2026-06-09T12:00:00.000Z' })
    createdAt: Date;
    @ApiProperty({ example: '2026-06-09T12:00:00.000Z' })
    updatedAt: Date;
    @ApiProperty({ example: null, nullable: true, type: String })
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
