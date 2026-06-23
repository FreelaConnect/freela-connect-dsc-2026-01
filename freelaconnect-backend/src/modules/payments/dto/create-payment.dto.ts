import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { PaymentStatusEnum } from '../../../common/enums/payment-status.enuns';

export class CreatePaymentDto {
    @ApiProperty({ example: 'order-123' })
    @IsString()
    @IsNotEmpty()
    ordemId!: string;

    @ApiProperty({ example: 1500 })
    @IsNumber()
    @IsNotEmpty()
    amount!: number;

    @ApiPropertyOptional({ enum: PaymentStatusEnum, example: PaymentStatusEnum.PENDING })
    @IsEnum(PaymentStatusEnum)
    @IsOptional()
    status?: PaymentStatusEnum;
}
