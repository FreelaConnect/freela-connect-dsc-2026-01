import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteUserDto {
  @IsNumber()
  @IsNotEmpty()
  version!: number;
}
