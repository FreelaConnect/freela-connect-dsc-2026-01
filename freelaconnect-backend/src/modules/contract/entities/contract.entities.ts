import { PaymentStatusEnum } from "src/common/enums/payment-status.enuns";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('contracts')

export class ContractEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'contract_id' })
    contractId!: string;

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

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @CreateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @CreateDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt: Date | null = null;

    constructor() {}
}