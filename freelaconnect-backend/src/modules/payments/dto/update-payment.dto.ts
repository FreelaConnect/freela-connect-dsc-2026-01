import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { PaymentStatusEnum } from '../../../common/enums/payment-status.enuns';

export class UpdatePaymentDto {
    @IsNumber()
    version!: number;

    @IsString()
    @IsOptional()
    ordemId?: string;

    @IsNumber()
    @IsOptional()
    amount?: number;

    @IsEnum(PaymentStatusEnum)
    @IsOptional()
    status?: PaymentStatusEnum;
}
