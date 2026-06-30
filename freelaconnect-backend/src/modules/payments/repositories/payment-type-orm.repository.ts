import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from '../entities/payment.entity';
import { Repository, IsNull } from 'typeorm';
import { PaymentVersionConflictException } from '../../../common/exceptions/payment-version-conflict.exception';

@Injectable()
export class PaymentTypeOrmRepository {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) {}

  async findById(paymentId: string): Promise<PaymentEntity | null> {
    return this.paymentRepository.findOne({ where: { paymentId } });
  }

  async findByOrderId(orderId: string): Promise<PaymentEntity | null> {
    return this.paymentRepository.findOne({ where: { ordemId: orderId } });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: PaymentEntity[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.paymentRepository.findAndCount({
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: skip,
    });

    return { data, total };
  }

  async save(payment: PaymentEntity): Promise<PaymentEntity> {
    return this.paymentRepository.save(payment);
  }

  async update(
    paymentId: string,
    paymentData: Partial<PaymentEntity>,
  ): Promise<PaymentEntity | null> {
    const payment = await this.findById(paymentId);
    if (!payment) {
      return null;
    }

    const clientVersion = (paymentData as any).version;
    if (clientVersion !== undefined && clientVersion !== payment.version) {
      throw new PaymentVersionConflictException(
        paymentId,
        clientVersion,
        payment.version,
      );
    }

    Object.assign(payment, paymentData);
    payment.version = payment.version + 1;

    await this.paymentRepository.update({ paymentId }, payment);
    return this.findById(paymentId);
  }

  async delete(paymentId: string, version?: number): Promise<boolean> {
    const payment = await this.findById(paymentId);
    if (!payment) {
      return false;
    }

    if (version !== undefined && version !== payment.version) {
      throw new PaymentVersionConflictException(
        paymentId,
        version,
        payment.version,
      );
    }

    payment.deletedAt = new Date();
    await this.paymentRepository.save(payment);
    return true;
  }
}
