import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PaymentStatusEnum } from '../src/common/enums/payment-status.enuns';
import {
  buildPaymentPayload,
  clearDatabase,
  createTestingApp,
  TestingApp,
} from './helpers/test-app';

describe('PaymentsController (e2e)', () => {
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

  async function createPayment(overrides = {}) {
    const payload = buildPaymentPayload(overrides);
    const response = await request(app.getHttpServer()).post('/payments').send(payload).expect(201);
    return response.body;
  }

  it('POST /payments cria pagamento', async () => {
    const payload = buildPaymentPayload();

    const response = await request(app.getHttpServer()).post('/payments').send(payload).expect(201);

    expect(response.body).toMatchObject({
      ordemId: payload.ordemId,
      status: payload.status,
      version: 1,
    });
    expect(Number(response.body.amount)).toBe(payload.amount);
  });

  it('GET /payments lista pagamentos', async () => {
    await createPayment();

    const response = await request(app.getHttpServer()).get('/payments').expect(200);

    expect(response.body).toMatchObject({
      data: expect.any(Array),
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    });
  });

  it('GET /payments/:id busca pagamento', async () => {
    const payment = await createPayment();

    const response = await request(app.getHttpServer())
      .get(`/payments/${payment.paymentId}`)
      .expect(200);

    expect(response.body.paymentId).toBe(payment.paymentId);
  });

  it('PATCH /payments/:id atualiza pagamento', async () => {
    const payment = await createPayment();

    const response = await request(app.getHttpServer())
      .patch(`/payments/${payment.paymentId}`)
      .send({ version: payment.version, status: PaymentStatusEnum.APPROVED })
      .expect(200);

    expect(response.body).toMatchObject({
      paymentId: payment.paymentId,
      status: PaymentStatusEnum.APPROVED,
      version: payment.version + 1,
    });
  });

  it('PUT /payments/:id substitui pagamento', async () => {
    const payment = await createPayment();
    const replacePayload = buildPaymentPayload({ status: PaymentStatusEnum.REJECTED, amount: 1750 });

    const response = await request(app.getHttpServer())
      .put(`/payments/${payment.paymentId}`)
      .send({ ...replacePayload, version: payment.version })
      .expect(200);

    expect(response.body).toMatchObject({
      paymentId: payment.paymentId,
      ordemId: replacePayload.ordemId,
      status: PaymentStatusEnum.REJECTED,
      version: payment.version + 1,
    });
    expect(Number(response.body.amount)).toBe(replacePayload.amount);
  });

  it('DELETE /payments/:id remove usando version', async () => {
    const payment = await createPayment();

    await request(app.getHttpServer())
      .delete(`/payments/${payment.paymentId}`)
      .send({ version: payment.version })
      .expect(200);

    const response = await request(app.getHttpServer()).get('/payments').expect(200);
    expect(response.body.total).toBe(0);
  });
});
