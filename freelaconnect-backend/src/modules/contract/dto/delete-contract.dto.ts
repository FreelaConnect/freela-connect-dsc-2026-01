import { IsNumber, IsNotEmpty } from 'class-validator';

export class DeleteContractDto {
    @IsNumber()
    @IsNotEmpty()
    version!: number;
}
