import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { PaymentStatusEnum } from '../../../common/enums/payment-status.enuns';

export class ReplaceContractDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    version!: number;

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

    @ApiProperty({ enum: PaymentStatusEnum, example: PaymentStatusEnum.PENDING })
    @IsEnum(PaymentStatusEnum)
    @IsNotEmpty()
    status!: PaymentStatusEnum;
}
