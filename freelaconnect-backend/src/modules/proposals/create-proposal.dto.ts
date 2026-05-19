import { IsString, IsNumber, IsPositive, IsNotEmpty } from 'class-validator';

export class CreateProposalDto {
  @IsNotEmpty()
  @IsString()
  projectId!: string;

  @IsNotEmpty()
  @IsString()
  freelancerId!: string;

  @IsNotEmpty()
  @IsString()
  coverLetter!: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  proposedValue!: number;

  @IsNotEmpty()
  @IsString()
  estimatedDeadline!: string;
}
