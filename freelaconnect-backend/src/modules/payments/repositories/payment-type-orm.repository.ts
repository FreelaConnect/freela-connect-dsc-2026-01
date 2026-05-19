import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaymentEntity } from "../entities/payment.entity";
import { Repository } from "typeorm";

@Injectable()
export class PaymentTypeOrmRepository {
    repository: any;
    constructor(
        @InjectRepository(PaymentEntity)
        private readonly paymentRepository: Repository<PaymentEntity>
        ) {}

    async findByOrderId(orderId: string): Promise<PaymentEntity | null> {
        return await this.repository.findOne({ where: { orderId } });
    }
}