import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus, ValidationPipe, Patch, Delete, Put, Query } from "@nestjs/common";
import { PaymentService } from "./services/payment.service";
import { PaymentResponseDto } from "./dto/payment-response.dto";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { DeletePaymentDto } from "./dto/delete-payment.dto";
import { PaginationDto } from "./dto/pagination.dto";

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentService: PaymentService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createPayment(
        @Body(ValidationPipe) createPaymentDto: CreatePaymentDto,
    ): Promise<PaymentResponseDto> {
        return this.paymentService.createPayment(createPaymentDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllPayments(
        @Query(ValidationPipe) paginationDto: PaginationDto,
    ): Promise<any> {
        const page = parseInt(String(paginationDto.page || 1), 10);
        const limit = parseInt(String(paginationDto.limit || 10), 10);
        return this.paymentService.getAllPayments(page, limit);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async updatePayment(
        @Param('id') id: string,
        @Body(ValidationPipe) updatePaymentDto: UpdatePaymentDto,
    ): Promise<PaymentResponseDto> {
        return this.paymentService.updatePayment(id, updatePaymentDto);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async replacePayment(
        @Param('id') id: string,
        @Body(ValidationPipe) updatePaymentDto: UpdatePaymentDto,
    ): Promise<PaymentResponseDto> {
        return this.paymentService.replacePayment(id, updatePaymentDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async deletePayment(
        @Param('id') id: string,
        @Body(ValidationPipe) deletePaymentDto: DeletePaymentDto,
    ): Promise<{ message: string }> {
        return this.paymentService.deletePayment(id, deletePaymentDto.version);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getById(@Param('id') id: string): Promise<PaymentResponseDto> {
        return this.paymentService.getById(id);
    }
}
