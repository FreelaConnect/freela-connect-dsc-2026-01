import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
  buildProposalPayload,
  clearDatabase,
  createTestingApp,
  TestingApp,
} from './helpers/test-app';

describe('ProposalsController (e2e)', () => {
  let app: INestApplication;
  let testingApp: TestingApp;

  beforeAll(async () => {
    testingApp = await createTestingApp();
    app = testingApp.app;
  });

  beforeEach(async () => {
    await clearDatabase(app);
  });

  afterAll(async () => {
    await app?.close();
  });

  it('POST /proposals/submit submete proposta', async () => {
    const payload = buildProposalPayload();

    const response = await request(app.getHttpServer())
      .post('/proposals/submit')
      .send(payload)
      .expect(201);

    expect(response.body).toMatchObject({
      projectId: payload.projectId,
      freelancerId: payload.freelancerId,
      coverLetter: payload.coverLetter,
      estimatedDeadline: payload.estimatedDeadline,
      status: 'PENDING',
    });
    expect(Number(response.body.proposedValue)).toBe(payload.proposedValue);
  });

  it('GET /proposals/:proposalId busca proposta', async () => {
    const payload = buildProposalPayload();
    const created = await request(app.getHttpServer())
      .post('/proposals/submit')
      .send(payload)
      .expect(201);

    const response = await request(app.getHttpServer())
      .get(`/proposals/${created.body.proposalId}`)
      .expect(200);

    expect(response.body).toMatchObject({
      proposalId: created.body.proposalId,
      projectId: payload.projectId,
      freelancerId: payload.freelancerId,
    });
  });

  it('GET /proposals/project/:projectId lista propostas por projeto', async () => {
    const projectId = 'project-e2e-shared';
    const first = buildProposalPayload({ projectId, freelancerId: 'freelancer-a' });
    const second = buildProposalPayload({ projectId, freelancerId: 'freelancer-b' });

    await request(app.getHttpServer()).post('/proposals/submit').send(first).expect(201);
    await request(app.getHttpServer()).post('/proposals/submit').send(second).expect(201);

    const response = await request(app.getHttpServer())
      .get(`/proposals/project/${projectId}`)
      .expect(200);

    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ projectId, freelancerId: first.freelancerId }),
        expect.objectContaining({ projectId, freelancerId: second.freelancerId }),
      ]),
    );
  });
});
