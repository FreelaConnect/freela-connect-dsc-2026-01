
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { PaymentEntity } from "./entities/payment.entity";
import { PAYMENTS_REPOSITORY } from "./repositories/payments.repository.interface";


@Module({
    imports: [TypeOrmModule.forFeature([PaymentEntity])],
    providers: [
        {
            provide: PAYMENTS_REPOSITORY,
            useClass: PaymentEntity

        }   
    ],  
    exports: [PAYMENTS_REPOSITORY],
})
export class PaymentModule {}
