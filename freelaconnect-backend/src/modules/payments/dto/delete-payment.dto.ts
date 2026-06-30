import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class DeletePaymentDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  version!: number;
}
