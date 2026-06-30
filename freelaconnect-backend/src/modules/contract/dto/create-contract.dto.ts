import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { PaymentStatusEnum } from '../../../common/enums/payment-status.enuns';

export class CreateContractDto {
  @ApiProperty({ example: 'freelancer-123' })
  @IsString()
  @IsNotEmpty()
  freelancerId!: string;

  @ApiProperty({ example: 'order-123' })
  @IsString()
  @IsNotEmpty()
  orderId!: string;

  @ApiProperty({ example: 'project-123' })
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @ApiPropertyOptional({
    enum: PaymentStatusEnum,
    example: PaymentStatusEnum.PENDING,
  })
  @IsEnum(PaymentStatusEnum)
  @IsOptional()
  status?: PaymentStatusEnum;
}
