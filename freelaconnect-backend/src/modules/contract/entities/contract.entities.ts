import { PaymentStatusEnum } from "src/common/enums/payment-status.enuns";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('contracts')

export class ContractEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'contract_id' })
    contractId: string;

    @Column({ name: 'freelancer_id' })
    freelancerId: string;

    @Column({ name: 'order_id' })
    orderId: string;

    @Column({ name: 'project_id' })
    projectId: string;

        @Column({ 
        type: 'enum',
        enum: PaymentStatusEnum,
        default: PaymentStatusEnum.PENDING,
    })
    status: PaymentStatusEnum;

    @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @CreateDateColumn({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @CreateDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt: Date | null;


    constructor (
        contractId: string,
        orderId: string,
        freelancerId: string,
        status: PaymentStatusEnum,
        projectId: string,
        updatedAt: Date,
        createdAt: Date,
        deletedAt: Date | null,
    ) {
        if (!contractId) {
            throw new Error('Contract ID is required');   }

        if (!orderId) {
            throw new Error('Order ID is required');   }

        if (!freelancerId) {
            throw new Error('Freelancer ID is required');   }

        if (!projectId) {
            throw new Error('Project ID is required');   }

        if (!status) {
            throw new Error('Status is required');   }

        if (!updatedAt) {
            throw new Error('Updated At is required');   }

        if  (!createdAt) {
            throw new Error('Created At is required');   }

        this.contractId = contractId;
        this.orderId = orderId;
        this.freelancerId = freelancerId;
        this.projectId = projectId;
        this.status = status;
        this.updatedAt = updatedAt;
        this.createdAt = createdAt;
        this.deletedAt = deletedAt;
        

    }
    
}