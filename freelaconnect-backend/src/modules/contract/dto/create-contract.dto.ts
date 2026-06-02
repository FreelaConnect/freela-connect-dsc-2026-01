import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { PaymentStatusEnum } from '../../../common/enums/payment-status.enuns';

export class CreateContractDto {
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
    @IsOptional()
    status?: PaymentStatusEnum;
}
