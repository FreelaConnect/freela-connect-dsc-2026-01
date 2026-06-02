import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { PaymentStatusEnum } from '../../../common/enums/payment-status.enuns';

export class UpdateContractDto {
    @IsNumber()
    version!: number;

    @IsString()
    @IsOptional()
    freelancerId?: string;

    @IsString()
    @IsOptional()
    orderId?: string;

    @IsString()
    @IsOptional()
    projectId?: string;

    @IsEnum(PaymentStatusEnum)
    @IsOptional()
    status?: PaymentStatusEnum;
}
