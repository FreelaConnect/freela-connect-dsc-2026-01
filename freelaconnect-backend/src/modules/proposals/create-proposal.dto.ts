import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, IsNotEmpty } from 'class-validator';

export class CreateProposalDto {
  @ApiProperty({ example: 'project-123' })
  @IsNotEmpty()
  @IsString()
  projectId!: string;

  @ApiProperty({ example: 'freelancer-123' })
  @IsNotEmpty()
  @IsString()
  freelancerId!: string;

  @ApiProperty({
    example: 'Tenho experiencia com NestJS e posso entregar em duas semanas.',
  })
  @IsNotEmpty()
  @IsString()
  coverLetter!: string;

  @ApiProperty({ example: 2500 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  proposedValue!: number;

  @ApiProperty({ example: '2026-07-01' })
  @IsNotEmpty()
  @IsString()
  estimatedDeadline!: string;
}
