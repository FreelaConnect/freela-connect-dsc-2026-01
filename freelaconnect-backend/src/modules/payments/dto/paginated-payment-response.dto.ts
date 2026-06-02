import { PaymentResponseDto } from './payment-response.dto';

export class PaginatedPaymentResponseDto {
    data: PaymentResponseDto[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;

    constructor(data: {
        data: PaymentResponseDto[];
        page: number;
        limit: number;
        total: number;
    }) {
        this.data = data.data;
        this.page = data.page;
        this.limit = data.limit;
        this.total = data.total;
        this.totalPages = Math.ceil(data.total / data.limit);
    }
}
