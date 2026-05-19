import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { ProposalRepository, PROPOSAL_REPOSITORY } from './proposal.repository';
import { ProposalEntity } from './proposal.entity';
import { ProposalStatus } from '../../common/enums/proposal-status.enum';
import { CreateProposalDto } from './create-proposal.dto';
import { ProposalResponseDto } from './proposal-response.dto';
import { ProjectNotFoundException } from './project-not-found.exception';
import { FreelancerValidationException } from './freelancer-validation.exception';

@Injectable()
export class ProposalService {
  constructor(
    @Inject(PROPOSAL_REPOSITORY)
    private readonly proposalRepository: ProposalRepository,
  ) {}

  async submitProposal(createProposalDto: CreateProposalDto): Promise<ProposalResponseDto> {
    const { projectId, freelancerId, coverLetter, proposedValue, estimatedDeadline } =
      createProposalDto;

    // Validate project exists
    // TODO: Implement project service validation when ProjectModule is completed
    if (!projectId || projectId.trim() === '') {
      throw new BadRequestException('Project ID is required and cannot be empty');
    }

    // Validate freelancer
    // TODO: Implement freelancer service validation when UsersModule is completed
    if (!freelancerId || freelancerId.trim() === '') {
      throw new BadRequestException('Freelancer ID is required and cannot be empty');
    }

    // Check if freelancer already submitted proposal to this project
    const existingProposal = await this.proposalRepository.findByProjectAndFreelancer(
      projectId,
      freelancerId,
    );

    if (existingProposal) {
      throw new BadRequestException(
        'You have already submitted a proposal to this project',
      );
    }

    // Create new proposal
    try {
      const proposal = new ProposalEntity();
      proposal.projectId = projectId;
      proposal.freelancerId = freelancerId;
      proposal.coverLetter = coverLetter;
      proposal.proposedValue = proposedValue;
      proposal.estimatedDeadline = estimatedDeadline;
      proposal.status = ProposalStatus.PENDING;

      const createdProposal = await this.proposalRepository.create(proposal);

      return new ProposalResponseDto({
        proposalId: createdProposal.proposalId,
        projectId: createdProposal.projectId,
        freelancerId: createdProposal.freelancerId,
        coverLetter: createdProposal.coverLetter,
        proposedValue: createdProposal.proposedValue,
        estimatedDeadline: createdProposal.estimatedDeadline,
        status: createdProposal.status,
        createdAt: createdProposal.createdAt,
        updatedAt: createdProposal.updatedAt,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Failed to create proposal');
    }
  }

  async getProposalById(proposalId: string): Promise<ProposalResponseDto> {
    const proposal = await this.proposalRepository.findById(proposalId);

    if (!proposal) {
      throw new NotFoundException(`Proposal with ID ${proposalId} not found`);
    }

    return new ProposalResponseDto({
      proposalId: proposal.proposalId,
      projectId: proposal.projectId,
      freelancerId: proposal.freelancerId,
      coverLetter: proposal.coverLetter,
      proposedValue: proposal.proposedValue,
      estimatedDeadline: proposal.estimatedDeadline,
      status: proposal.status,
      createdAt: proposal.createdAt,
      updatedAt: proposal.updatedAt,
    });
  }

  async getProposalsByProjectId(projectId: string): Promise<ProposalResponseDto[]> {
    const proposals = await this.proposalRepository.findByProjectId(projectId);

    return proposals.map(
      (proposal: ProposalEntity) =>
        new ProposalResponseDto({
          proposalId: proposal.proposalId,
          projectId: proposal.projectId,
          freelancerId: proposal.freelancerId,
          coverLetter: proposal.coverLetter,
          proposedValue: proposal.proposedValue,
          estimatedDeadline: proposal.estimatedDeadline,
          status: proposal.status,
          createdAt: proposal.createdAt,
          updatedAt: proposal.updatedAt,
        }),
    );
  }
}
