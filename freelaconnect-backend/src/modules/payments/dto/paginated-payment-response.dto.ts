import { ApiProperty } from '@nestjs/swagger';
import { PaymentResponseDto } from './payment-response.dto';

export class PaginatedPaymentResponseDto {
  @ApiProperty({ type: [PaymentResponseDto] })
  data: PaymentResponseDto[];
  @ApiProperty({ example: 1 })
  page: number;
  @ApiProperty({ example: 10 })
  limit: number;
  @ApiProperty({ example: 20 })
  total: number;
  @ApiProperty({ example: 2 })
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
