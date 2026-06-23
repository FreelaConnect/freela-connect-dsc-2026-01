import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus, ValidationPipe, Patch, Delete, Put, Query } from "@nestjs/common";
import { ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { PaymentService } from "./services/payment.service";
import { PaymentResponseDto } from "./dto/payment-response.dto";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { DeletePaymentDto } from "./dto/delete-payment.dto";
import { PaginationDto } from "./dto/pagination.dto";
import { PaginatedPaymentResponseDto } from "./dto/paginated-payment-response.dto";

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentService: PaymentService) {}

    @Post()
    @ApiOperation({ summary: 'Cria um novo pagamento' })
    @ApiCreatedResponse({ description: 'Pagamento criado com sucesso.', type: PaymentResponseDto })
    @HttpCode(HttpStatus.CREATED)
    async createPayment(
        @Body(ValidationPipe) createPaymentDto: CreatePaymentDto,
    ): Promise<PaymentResponseDto> {
        return this.paymentService.createPayment(createPaymentDto);
    }

    @Get()
    @ApiOperation({ summary: 'Lista pagamentos com paginacao' })
    @ApiOkResponse({ description: 'Pagamentos retornados com sucesso.', type: PaginatedPaymentResponseDto })
    @HttpCode(HttpStatus.OK)
    async getAllPayments(
        @Query(ValidationPipe) paginationDto: PaginationDto,
    ): Promise<any> {
        const page = parseInt(String(paginationDto.page || 1), 10);
        const limit = parseInt(String(paginationDto.limit || 10), 10);
        return this.paymentService.getAllPayments(page, limit);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualiza parcialmente um pagamento' })
    @ApiParam({ name: 'id', example: 'payment-123' })
    @ApiOkResponse({ description: 'Pagamento atualizado com sucesso.', type: PaymentResponseDto })
    @ApiNotFoundResponse({ description: 'Pagamento nao encontrado.' })
    @HttpCode(HttpStatus.OK)
    async updatePayment(
        @Param('id') id: string,
        @Body(ValidationPipe) updatePaymentDto: UpdatePaymentDto,
    ): Promise<PaymentResponseDto> {
        return this.paymentService.updatePayment(id, updatePaymentDto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Substitui os dados de um pagamento' })
    @ApiParam({ name: 'id', example: 'payment-123' })
    @ApiOkResponse({ description: 'Pagamento substituido com sucesso.', type: PaymentResponseDto })
    @ApiNotFoundResponse({ description: 'Pagamento nao encontrado.' })
    @HttpCode(HttpStatus.OK)
    async replacePayment(
        @Param('id') id: string,
        @Body(ValidationPipe) updatePaymentDto: UpdatePaymentDto,
    ): Promise<PaymentResponseDto> {
        return this.paymentService.replacePayment(id, updatePaymentDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove um pagamento por id' })
    @ApiParam({ name: 'id', example: 'payment-123' })
    @ApiBody({ type: DeletePaymentDto })
    @ApiOkResponse({ description: 'Pagamento removido com sucesso.' })
    @ApiNotFoundResponse({ description: 'Pagamento nao encontrado.' })
    @HttpCode(HttpStatus.OK)
    async deletePayment(
        @Param('id') id: string,
        @Body(ValidationPipe) deletePaymentDto: DeletePaymentDto,
    ): Promise<{ message: string }> {
        return this.paymentService.deletePayment(id, deletePaymentDto.version);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Busca um pagamento por id' })
    @ApiParam({ name: 'id', example: 'payment-123' })
    @ApiOkResponse({ description: 'Pagamento encontrado.', type: PaymentResponseDto })
    @ApiNotFoundResponse({ description: 'Pagamento nao encontrado.' })
    @HttpCode(HttpStatus.OK)
    async getById(@Param('id') id: string): Promise<PaymentResponseDto> {
        return this.paymentService.getById(id);
    }
}
