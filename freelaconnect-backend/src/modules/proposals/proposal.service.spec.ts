import { Test, TestingModule } from '@nestjs/testing';
import { ProposalService } from './proposal.service';
import { ProposalRepository, PROPOSAL_REPOSITORY } from './proposal.repository';
import { ProposalEntity } from './proposal.entity';
import { ProposalStatus } from '../../common/enums/proposal-status.enum';
import { CreateProposalDto } from './create-proposal.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ProposalService', () => {
  let service: ProposalService;
  let mockRepository: Partial<ProposalRepository>;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByProjectAndFreelancer: jest.fn(),
      findByProjectId: jest.fn(),
      findByFreelancerId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProposalService,
        {
          provide: PROPOSAL_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProposalService>(ProposalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('submitProposal', () => {
    it('should create a new proposal successfully', async () => {
      const createProposalDto: CreateProposalDto = {
        projectId: 'project-123',
        freelancerId: 'freelancer-456',
        coverLetter: 'I am very interested in this project',
        proposedValue: 1500,
        estimatedDeadline: '15 days',
      };

      const createdProposal: ProposalEntity = {
        proposalId: 'proposal-789',
        projectId: createProposalDto.projectId,
        freelancerId: createProposalDto.freelancerId,
        coverLetter: createProposalDto.coverLetter,
        proposedValue: createProposalDto.proposedValue,
        estimatedDeadline: createProposalDto.estimatedDeadline,
        status: ProposalStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (
        mockRepository.findByProjectAndFreelancer as jest.Mock
      ).mockResolvedValue(null);
      (mockRepository.create as jest.Mock).mockResolvedValue(createdProposal);

      const result = await service.submitProposal(createProposalDto);

      expect(result.proposalId).toBe(createdProposal.proposalId);
      expect(result.status).toBe(ProposalStatus.PENDING);
      expect(mockRepository.create).toHaveBeenCalled();
    });

    it('should throw error if freelancer already submitted proposal to project', async () => {
      const createProposalDto: CreateProposalDto = {
        projectId: 'project-123',
        freelancerId: 'freelancer-456',
        coverLetter: 'I am very interested in this project',
        proposedValue: 1500,
        estimatedDeadline: '15 days',
      };

      const existingProposal: ProposalEntity = {
        proposalId: 'proposal-existing',
        projectId: createProposalDto.projectId,
        freelancerId: createProposalDto.freelancerId,
        coverLetter: 'Previous proposal',
        proposedValue: 1200,
        estimatedDeadline: '20 days',
        status: ProposalStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (
        mockRepository.findByProjectAndFreelancer as jest.Mock
      ).mockResolvedValue(existingProposal);

      await expect(service.submitProposal(createProposalDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw error if projectId is empty', async () => {
      const createProposalDto: CreateProposalDto = {
        projectId: '',
        freelancerId: 'freelancer-456',
        coverLetter: 'I am very interested in this project',
        proposedValue: 1500,
        estimatedDeadline: '15 days',
      };

      await expect(service.submitProposal(createProposalDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw error if freelancerId is empty', async () => {
      const createProposalDto: CreateProposalDto = {
        projectId: 'project-123',
        freelancerId: '',
        coverLetter: 'I am very interested in this project',
        proposedValue: 1500,
        estimatedDeadline: '15 days',
      };

      await expect(service.submitProposal(createProposalDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getProposalById', () => {
    it('should return a proposal when found', async () => {
      const proposal: ProposalEntity = {
        proposalId: 'proposal-123',
        projectId: 'project-123',
        freelancerId: 'freelancer-456',
        coverLetter: 'Test proposal',
        proposedValue: 1500,
        estimatedDeadline: '15 days',
        status: ProposalStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockRepository.findById as jest.Mock).mockResolvedValue(proposal);

      const result = await service.getProposalById('proposal-123');

      expect(result.proposalId).toBe(proposal.proposalId);
      expect(mockRepository.findById).toHaveBeenCalledWith('proposal-123');
    });

    it('should throw NotFoundException when proposal not found', async () => {
      (mockRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.getProposalById('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getProposalsByProjectId', () => {
    it('should return all proposals for a project', async () => {
      const proposals: ProposalEntity[] = [
        {
          proposalId: 'proposal-1',
          projectId: 'project-123',
          freelancerId: 'freelancer-1',
          coverLetter: 'Proposal 1',
          proposedValue: 1000,
          estimatedDeadline: '10 days',
          status: ProposalStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          proposalId: 'proposal-2',
          projectId: 'project-123',
          freelancerId: 'freelancer-2',
          coverLetter: 'Proposal 2',
          proposedValue: 1500,
          estimatedDeadline: '15 days',
          status: ProposalStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (mockRepository.findByProjectId as jest.Mock).mockResolvedValue(
        proposals,
      );

      const result = await service.getProposalsByProjectId('project-123');

      expect(result).toHaveLength(2);
      expect(result[0].proposalId).toBe('proposal-1');
      expect(mockRepository.findByProjectId).toHaveBeenCalledWith(
        'project-123',
      );
    });
  });
});
