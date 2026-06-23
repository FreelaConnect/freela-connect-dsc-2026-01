import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  version!: number;
}
