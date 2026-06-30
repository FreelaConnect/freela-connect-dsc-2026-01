import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { PaymentStatusEnum } from '../../../common/enums/payment-status.enuns';

export class UpdatePaymentDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  version!: number;

  @ApiPropertyOptional({ example: 'order-123' })
  @IsString()
  @IsOptional()
  ordemId?: string;

  @ApiPropertyOptional({ example: 1500 })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiPropertyOptional({
    enum: PaymentStatusEnum,
    example: PaymentStatusEnum.PENDING,
  })
  @IsEnum(PaymentStatusEnum)
  @IsOptional()
  status?: PaymentStatusEnum;
}
