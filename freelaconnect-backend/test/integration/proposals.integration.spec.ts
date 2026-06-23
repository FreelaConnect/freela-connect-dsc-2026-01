import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { ProposalService } from '../../src/modules/proposals/proposal.service';
import {
  buildProposalPayload,
  clearDatabase,
  createTestingModule,
} from '../helpers/test-app';

describe('ProposalService integration', () => {
  let moduleRef: TestingModule;
  let proposalService: ProposalService;

  beforeAll(async () => {
    moduleRef = await createTestingModule();
    proposalService = moduleRef.get(ProposalService, { strict: false });
  });

  beforeEach(async () => {
    await clearDatabase(moduleRef);
  });

  afterAll(async () => {
    await moduleRef?.close();
  });

  it('submete proposta valida', async () => {
    const payload = buildProposalPayload();

    const proposal = await proposalService.submitProposal(payload);

    expect(proposal).toMatchObject({
      projectId: payload.projectId,
      freelancerId: payload.freelancerId,
      coverLetter: payload.coverLetter,
      estimatedDeadline: payload.estimatedDeadline,
      status: 'PENDING',
    });
    expect(Number(proposal.proposedValue)).toBe(payload.proposedValue);
  });

  it('busca proposta por id e lista por projeto', async () => {
    const payload = buildProposalPayload();
    const created = await proposalService.submitProposal(payload);

    await expect(proposalService.getProposalById(created.proposalId)).resolves.toMatchObject({
      proposalId: created.proposalId,
      projectId: payload.projectId,
    });
    await expect(proposalService.getProposalsByProjectId(payload.projectId)).resolves.toEqual([
      expect.objectContaining({ proposalId: created.proposalId }),
    ]);
  });

  it('cobre erro de proposta duplicada no mesmo projeto e freelancer', async () => {
    const payload = buildProposalPayload();
    await proposalService.submitProposal(payload);

    await expect(proposalService.submitProposal(payload)).rejects.toThrow(BadRequestException);
  });

  it('cobre erro de projeto vazio', async () => {
    await expect(
      proposalService.submitProposal(buildProposalPayload({ projectId: '' })),
    ).rejects.toThrow(BadRequestException);
  });

  it('cobre erro de freelancer vazio', async () => {
    await expect(
      proposalService.submitProposal(buildProposalPayload({ freelancerId: '' })),
    ).rejects.toThrow(BadRequestException);
  });

  it('cobre erro de proposta inexistente', async () => {
    await expect(proposalService.getProposalById('missing-proposal')).rejects.toThrow(
      NotFoundException,
    );
  });
});
