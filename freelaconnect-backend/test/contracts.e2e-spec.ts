import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PaymentStatusEnum } from '../src/common/enums/payment-status.enuns';
import {
  buildContractPayload,
  clearDatabase,
  createTestingApp,
  TestingApp,
} from './helpers/test-app';

describe('ContractsController (e2e)', () => {
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

  async function createContract(overrides = {}) {
    const payload = buildContractPayload(overrides);
    const response = await request(app.getHttpServer())
      .post('/contracts')
      .send(payload)
      .expect(201);
    return response.body;
  }

  it('/contracts (GET) - should return paginated contracts', async () => {
    await createContract();

    const response = await request(app.getHttpServer()).get('/contracts').expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('page');
    expect(response.body).toHaveProperty('limit');
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('totalPages');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('/contracts (GET) - should support pagination parameters', async () => {
    await Promise.all([createContract(), createContract(), createContract(), createContract(), createContract(), createContract()]);

    const response = await request(app.getHttpServer()).get('/contracts?page=1&limit=5').expect(200);

    expect(response.body.page).toBe(1);
    expect(response.body.limit).toBe(5);
    expect(response.body.data).toHaveLength(5);
  });

  it('POST /contracts cria contrato', async () => {
    const payload = buildContractPayload();

    const response = await request(app.getHttpServer()).post('/contracts').send(payload).expect(201);

    expect(response.body).toMatchObject({
      freelancerId: payload.freelancerId,
      orderId: payload.orderId,
      projectId: payload.projectId,
      status: payload.status,
      version: 1,
    });
  });

  it('GET /contracts/:id busca por id', async () => {
    const contract = await createContract();

    const response = await request(app.getHttpServer())
      .get(`/contracts/${contract.contractId}`)
      .expect(200);

    expect(response.body.contractId).toBe(contract.contractId);
  });

  it('PATCH /contracts/:id atualiza parcialmente', async () => {
    const contract = await createContract();

    const response = await request(app.getHttpServer())
      .patch(`/contracts/${contract.contractId}`)
      .send({ version: contract.version, status: PaymentStatusEnum.APPROVED })
      .expect(200);

    expect(response.body).toMatchObject({
      contractId: contract.contractId,
      status: PaymentStatusEnum.APPROVED,
      version: contract.version + 1,
    });
  });

  it('PUT /contracts/:id substitui dados', async () => {
    const contract = await createContract();
    const replacePayload = buildContractPayload({ status: PaymentStatusEnum.REJECTED });

    const response = await request(app.getHttpServer())
      .put(`/contracts/${contract.contractId}`)
      .send({ ...replacePayload, version: contract.version })
      .expect(200);

    expect(response.body).toMatchObject({
      contractId: contract.contractId,
      freelancerId: replacePayload.freelancerId,
      orderId: replacePayload.orderId,
      projectId: replacePayload.projectId,
      status: PaymentStatusEnum.REJECTED,
      version: contract.version + 1,
    });
  });

  it('POST /contracts/:id/confirm confirma contrato', async () => {
    const contract = await createContract();

    const response = await request(app.getHttpServer())
      .post(`/contracts/${contract.contractId}/confirm`)
      .expect(201);

    expect(response.body).toMatchObject({
      id: String(contract.contractId),
      status: PaymentStatusEnum.APPROVED,
    });
  });

  it('DELETE /contracts/:id remove usando version', async () => {
    const contract = await createContract();

    await request(app.getHttpServer())
      .delete(`/contracts/${contract.contractId}`)
      .send({ version: contract.version })
      .expect(200);

    const response = await request(app.getHttpServer()).get('/contracts').expect(200);
    expect(response.body.total).toBe(0);
  });
});
