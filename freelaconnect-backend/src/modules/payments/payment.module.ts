import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PaymentEntity } from './entities/payment.entity';
import { PAYMENTS_REPOSITORY } from './repositories/payments.repository.interface';
import { PaymentTypeOrmRepository } from './repositories/payment-type-orm.repository';
import { PaymentService } from './services/payment.service';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity])],
  providers: [
    {
      provide: PAYMENTS_REPOSITORY,
      useClass: PaymentTypeOrmRepository,
    },
    PaymentService,
  ],
  controllers: [PaymentsController],
  exports: [PAYMENTS_REPOSITORY],
})
export class PaymentModule {}
