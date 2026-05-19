import { ProposalStatus } from '../../common/enums/proposal-status.enum';

export class ProposalResponseDto {
  proposalId: string;
  projectId: string;
  freelancerId: string;
  coverLetter: string;
  proposedValue: number;
  estimatedDeadline: string;
  status: ProposalStatus;
  createdAt: Date;
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
