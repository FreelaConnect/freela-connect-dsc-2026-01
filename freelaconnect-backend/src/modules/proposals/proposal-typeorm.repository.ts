import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProposalEntity } from './proposal.entity';
import { ProposalRepository } from './proposal.repository';

@Injectable()
export class ProposalTypeOrmRepository implements ProposalRepository {
  constructor(
    @InjectRepository(ProposalEntity)
    private readonly repository: Repository<ProposalEntity>,
  ) {}

  async create(proposal: ProposalEntity): Promise<ProposalEntity> {
    return this.repository.save(proposal);
  }

  async findById(proposalId: string): Promise<ProposalEntity | null> {
    return this.repository.findOne({
      where: { proposalId },
    });
  }

  async findByProjectAndFreelancer(
    projectId: string,
    freelancerId: string,
  ): Promise<ProposalEntity | null> {
    return this.repository.findOne({
      where: { projectId, freelancerId },
    });
  }

  async findByProjectId(projectId: string): Promise<ProposalEntity[]> {
    return this.repository.find({
      where: { projectId },
    });
  }

  async findByFreelancerId(freelancerId: string): Promise<ProposalEntity[]> {
    return this.repository.find({
      where: { freelancerId },
    });
  }

  async update(proposalId: string, proposal: Partial<ProposalEntity>): Promise<ProposalEntity> {
    await this.repository.update(proposalId, proposal);
    const updated = await this.repository.findOne({
      where: { proposalId },
    });
    if (!updated) {
      throw new Error(`Proposal with ID ${proposalId} not found`);
    }
    return updated;
  }

  async delete(proposalId: string): Promise<void> {
    await this.repository.delete(proposalId);
  }
}
