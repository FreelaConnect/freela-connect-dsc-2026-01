import { IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { PaymentStatusEnum } from '../../../common/enums/payment-status.enuns';

export class ReplaceContractDto {
    @IsNumber()
    @IsNotEmpty()
    version!: number;

    @IsString()
    @IsNotEmpty()
    freelancerId!: string;

    @IsString()
    @IsNotEmpty()
    orderId!: string;

    @IsString()
    @IsNotEmpty()
    projectId!: string;

    @IsEnum(PaymentStatusEnum)
    @IsNotEmpty()
    status!: PaymentStatusEnum;
}
