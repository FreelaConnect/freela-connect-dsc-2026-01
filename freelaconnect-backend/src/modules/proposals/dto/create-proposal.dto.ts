import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProposalDto {
  @IsNotEmpty({ message: 'O projectId é obrigatório.' })
  @IsString()
  projectId: string;
}