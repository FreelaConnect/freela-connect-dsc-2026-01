import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { PaymentStatusEnum } from '../../../common/enums/payment-status.enuns';

export class UpdateContractDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  version!: number;

  @ApiPropertyOptional({ example: 'freelancer-123' })
  @IsString()
  @IsOptional()
  freelancerId?: string;

  @ApiPropertyOptional({ example: 'order-123' })
  @IsString()
  @IsOptional()
  orderId?: string;

  @ApiPropertyOptional({ example: 'project-123' })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional({
    enum: PaymentStatusEnum,
    example: PaymentStatusEnum.PENDING,
  })
  @IsEnum(PaymentStatusEnum)
  @IsOptional()
  status?: PaymentStatusEnum;
}
