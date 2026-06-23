import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { ProposalController } from './proposal.controller';
import { ProposalService } from './proposal.service';
import { ProposalStatus } from '../../common/enums/proposal-status.enum';

describe('ProposalController (Integration Tests)', () => {
  let app: INestApplication;
  let proposalService: ProposalService;

  beforeEach(async () => {
    const mockProposalService = {
      submitProposal: jest.fn(),
      getProposalById: jest.fn(),
      getProposalsByProjectId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProposalController],
      providers: [
        {
          provide: ProposalService,
          useValue: mockProposalService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    proposalService = module.get<ProposalService>(ProposalService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /proposals/submit', () => {
    it('should submit a proposal successfully', async () => {
      const createProposalDto = {
        projectId: 'project-123',
        freelancerId: 'freelancer-456',
        coverLetter: 'I am very interested in this project',
        proposedValue: 1500,
        estimatedDeadline: '15 days',
      };

      const responseDto = {
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

      (proposalService.submitProposal as jest.Mock).mockResolvedValue(responseDto);

      const response = await request(app.getHttpServer())
        .post('/proposals/submit')
        .send(createProposalDto)
        .expect(201);

      expect(response.body.proposalId).toBe(responseDto.proposalId);
      expect(response.body.status).toBe(ProposalStatus.PENDING);
      expect(proposalService.submitProposal).toHaveBeenCalledWith(createProposalDto);
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidDto = {
        projectId: 'project-123',
        coverLetter: 'Test',
        // Missing freelancerId, proposedValue, estimatedDeadline
      };

      await request(app.getHttpServer()).post('/proposals/submit').send(invalidDto).expect(400);
    });

    it('should return 400 if proposedValue is not positive', async () => {
      const invalidDto = {
        projectId: 'project-123',
        freelancerId: 'freelancer-456',
        coverLetter: 'Test',
        proposedValue: -100,
        estimatedDeadline: '15 days',
      };

      await request(app.getHttpServer()).post('/proposals/submit').send(invalidDto).expect(400);
    });
  });

  describe('GET /proposals/:proposalId', () => {
    it('should return a proposal by id', async () => {
      const proposalId = 'proposal-123';
      const responseDto = {
        proposalId,
        projectId: 'project-123',
        freelancerId: 'freelancer-456',
        coverLetter: 'Test proposal',
        proposedValue: 1500,
        estimatedDeadline: '15 days',
        status: ProposalStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (proposalService.getProposalById as jest.Mock).mockResolvedValue(responseDto);

      const response = await request(app.getHttpServer())
        .get(`/proposals/${proposalId}`)
        .expect(200);

      expect(response.body.proposalId).toBe(proposalId);
      expect(proposalService.getProposalById).toHaveBeenCalledWith(proposalId);
    });
  });

  describe('GET /proposals/project/:projectId', () => {
    it('should return all proposals for a project', async () => {
      const projectId = 'project-123';
      const responseDtos = [
        {
          proposalId: 'proposal-1',
          projectId,
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
          projectId,
          freelancerId: 'freelancer-2',
          coverLetter: 'Proposal 2',
          proposedValue: 1500,
          estimatedDeadline: '15 days',
          status: ProposalStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (proposalService.getProposalsByProjectId as jest.Mock).mockResolvedValue(responseDtos);

      const response = await request(app.getHttpServer())
        .get(`/proposals/project/${projectId}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].proposalId).toBe('proposal-1');
      expect(proposalService.getProposalsByProjectId).toHaveBeenCalledWith(projectId);
    });

    it('should return empty array if no proposals found', async () => {
      const projectId = 'project-no-proposals';

      (proposalService.getProposalsByProjectId as jest.Mock).mockResolvedValue([]);

      const response = await request(app.getHttpServer())
        .get(`/proposals/project/${projectId}`)
        .expect(200);

      expect(response.body).toHaveLength(0);
    });
  });
});
