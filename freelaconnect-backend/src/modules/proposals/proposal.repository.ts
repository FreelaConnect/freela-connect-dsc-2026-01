import { ProposalEntity } from './proposal.entity';

export interface ProposalRepository {
  create(proposal: ProposalEntity): Promise<ProposalEntity>;
  findById(proposalId: string): Promise<ProposalEntity | null>;
  findByProjectAndFreelancer(
    projectId: string,
    freelancerId: string,
  ): Promise<ProposalEntity | null>;
  findByProjectId(projectId: string): Promise<ProposalEntity[]>;
  findByFreelancerId(freelancerId: string): Promise<ProposalEntity[]>;
  update(proposalId: string, proposal: Partial<ProposalEntity>): Promise<ProposalEntity>;
  delete(proposalId: string): Promise<void>;
}

export const PROPOSAL_REPOSITORY = 'PROPOSAL_REPOSITORY';
