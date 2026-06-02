import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PAYMENTS_REPOSITORY } from '../repositories/payments.repository.interface';
import type { PaymentsRepository } from '../repositories/payments.repository.interface';
import { PaymentResponseDto } from '../dto/payment-response.dto';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { PaymentEntity } from '../entities/payment.entity';
import { PaymentStatusEnum } from '../../../common/enums/payment-status.enuns';

@Injectable()
export class PaymentService {
    constructor(
        @Inject(PAYMENTS_REPOSITORY)
        private readonly paymentRepository: PaymentsRepository,
    ) {}

    async getById(paymentId: string): Promise<PaymentResponseDto> {
        const payment = await this.paymentRepository.findById(paymentId);
        if (!payment) {
            throw new NotFoundException(`Pagamento com ID ${paymentId} não encontrado`);
        }

        return new PaymentResponseDto({
            paymentId: payment.paymentId,
            ordemId: payment.ordemId,
            status: payment.status,
            amount: payment.amount,
            paidAt: payment.paidAt,
            version: payment.version,
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt,
            deletedAt: payment.deletedAt,
        });
    }

    async getAllPayments(page: number = 1, limit: number = 10): Promise<any> {
        const { data, total } = await this.paymentRepository.findAll(page, limit);
        
        const mappedData = data.map(payment => new PaymentResponseDto({
            paymentId: payment.paymentId,
            ordemId: payment.ordemId,
            status: payment.status,
            amount: payment.amount,
            paidAt: payment.paidAt,
            version: payment.version,
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt,
            deletedAt: payment.deletedAt,
        }));

        return {
            data: mappedData,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        };
    }

    async createPayment(createPaymentDto: CreatePaymentDto): Promise<PaymentResponseDto> {
        const payment = new PaymentEntity();
        payment.ordemId = createPaymentDto.ordemId;
        payment.amount = createPaymentDto.amount;
        payment.status = createPaymentDto.status || PaymentStatusEnum.PENDING;

        const savedPayment = await this.paymentRepository.save(payment);
        
        return new PaymentResponseDto({
            paymentId: savedPayment.paymentId,
            ordemId: savedPayment.ordemId,
            status: savedPayment.status,
            amount: savedPayment.amount,
            paidAt: savedPayment.paidAt,
            version: savedPayment.version,
            createdAt: savedPayment.createdAt,
            updatedAt: savedPayment.updatedAt,
            deletedAt: savedPayment.deletedAt,
        });
    }

    async updatePayment(paymentId: string, updatePaymentDto: UpdatePaymentDto): Promise<PaymentResponseDto> {
        const payment = await this.paymentRepository.findById(paymentId);
        if (!payment) {
            throw new NotFoundException(`Pagamento com ID ${paymentId} não encontrado`);
        }

        const updatedPayment = await this.paymentRepository.update(paymentId, updatePaymentDto);
        if (!updatedPayment) {
            throw new NotFoundException(`Falha ao atualizar pagamento com ID ${paymentId}`);
        }

        return new PaymentResponseDto({
            paymentId: updatedPayment.paymentId,
            ordemId: updatedPayment.ordemId,
            status: updatedPayment.status,
            amount: updatedPayment.amount,
            paidAt: updatedPayment.paidAt,
            version: updatedPayment.version,
            createdAt: updatedPayment.createdAt,
            updatedAt: updatedPayment.updatedAt,
            deletedAt: updatedPayment.deletedAt,
        });
    }

    async replacePayment(paymentId: string, updatePaymentDto: UpdatePaymentDto): Promise<PaymentResponseDto> {
        const payment = await this.paymentRepository.findById(paymentId);
        if (!payment) {
            throw new NotFoundException(`Pagamento com ID ${paymentId} não encontrado`);
        }

        const replacedPayment = await this.paymentRepository.update(paymentId, updatePaymentDto);
        if (!replacedPayment) {
            throw new NotFoundException(`Falha ao substituir pagamento com ID ${paymentId}`);
        }

        return new PaymentResponseDto({
            paymentId: replacedPayment.paymentId,
            ordemId: replacedPayment.ordemId,
            status: replacedPayment.status,
            amount: replacedPayment.amount,
            paidAt: replacedPayment.paidAt,
            version: replacedPayment.version,
            createdAt: replacedPayment.createdAt,
            updatedAt: replacedPayment.updatedAt,
            deletedAt: replacedPayment.deletedAt,
        });
    }

    async deletePayment(paymentId: string, version?: number): Promise<{ message: string }> {
        const payment = await this.paymentRepository.findById(paymentId);
        if (!payment) {
            throw new NotFoundException(`Pagamento com ID ${paymentId} não encontrado`);
        }

        const deleted = await this.paymentRepository.delete(paymentId, version);
        if (!deleted) {
            throw new NotFoundException(`Falha ao deletar pagamento com ID ${paymentId}`);
        }

        return { message: `Pagamento ${paymentId} deletado com sucesso` };
    }
}
