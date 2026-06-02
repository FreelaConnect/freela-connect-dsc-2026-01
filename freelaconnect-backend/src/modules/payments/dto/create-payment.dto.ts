import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { PaymentStatusEnum } from '../../../common/enums/payment-status.enuns';

export class CreatePaymentDto {
    @IsString()
    @IsNotEmpty()
    ordemId!: string;

    @IsNumber()
    @IsNotEmpty()
    amount!: number;

    @IsEnum(PaymentStatusEnum)
    @IsOptional()
    status?: PaymentStatusEnum;
}
