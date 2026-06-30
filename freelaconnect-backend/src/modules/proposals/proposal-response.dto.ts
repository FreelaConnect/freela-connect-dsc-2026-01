import { ApiProperty } from '@nestjs/swagger';
import { ProposalStatus } from '../../common/enums/proposal-status.enum';

export class ProposalResponseDto {
  @ApiProperty({ example: 'proposal-123' })
  proposalId: string;
  @ApiProperty({ example: 'project-123' })
  projectId: string;
  @ApiProperty({ example: 'freelancer-123' })
  freelancerId: string;
  @ApiProperty({
    example: 'Tenho experiencia com NestJS e posso entregar em duas semanas.',
  })
  coverLetter: string;
  @ApiProperty({ example: 2500 })
  proposedValue: number;
  @ApiProperty({ example: '2026-07-01' })
  estimatedDeadline: string;
  @ApiProperty({ enum: ProposalStatus, example: ProposalStatus.PENDING })
  status: ProposalStatus;
  @ApiProperty({ example: '2026-06-09T12:00:00.000Z' })
  createdAt: Date;
  @ApiProperty({ example: '2026-06-09T12:00:00.000Z' })
  updatedAt: Date;

  constructor(proposal: {
    proposalId: string;
    projectId: string;
    freelancerId: string;
    coverLetter: string;
    proposedValue: number;
    estimatedDeadline: string;
    status: ProposalStatus;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.proposalId = proposal.proposalId;
    this.projectId = proposal.projectId;
    this.freelancerId = proposal.freelancerId;
    this.coverLetter = proposal.coverLetter;
    this.proposedValue = proposal.proposedValue;
    this.estimatedDeadline = proposal.estimatedDeadline;
    this.status = proposal.status;
    this.createdAt = proposal.createdAt;
    this.updatedAt = proposal.updatedAt;
  }
}
