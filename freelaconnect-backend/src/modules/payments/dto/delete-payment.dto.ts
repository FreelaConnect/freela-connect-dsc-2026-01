import { IsNumber, IsNotEmpty } from 'class-validator';

export class DeletePaymentDto {
    @IsNumber()
    @IsNotEmpty()
    version!: number;
}
