import { PaymentStatusEnum } from "src/common/enums/payment-status.enuns";
import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("payments")
export class PaymentEntity {
    @PrimaryGeneratedColumn("uuid", {name: "payment_id"})
    paymentId!: string;
    
    @Column({name: "ordem_id"})
    ordemId!: string;

    @Column({
        type: "enum", 
        enum: PaymentStatusEnum, 
        default: PaymentStatusEnum.PENDING
    })
    status: PaymentStatusEnum = PaymentStatusEnum.PENDING;

    @Column({type: "numeric", precision: 10, scale: 2})
    amount!: number;
    
    @Column({name: "paid_at", type: "timestamp", nullable: true})
    paidAt: Date | null = null;

    @Column({name: "created_at"})
    createdAt!: Date;
    
    @Column({name: "updated_at"})
    updatedAt!: Date;

    @DeleteDateColumn({ name: "deleted_at", nullable: true })
    deletedAt: Date | null = null;

    constructor() {}
}
