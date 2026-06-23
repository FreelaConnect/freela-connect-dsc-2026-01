import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
  buildUserPayload,
  clearDatabase,
  createTestingApp,
  registerAndLogin,
  TestingApp,
} from './helpers/test-app';

describe('Auth and Users (e2e)', () => {
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

  it('POST /users cria usuario com 201', async () => {
    const payload = buildUserPayload();

    const response = await request(app.getHttpServer()).post('/users').send(payload).expect(201);

    expect(response.body).toMatchObject({
      name: payload.name,
      email: payload.email,
      role: payload.role,
      version: 1,
    });
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('passwordHash');
  });

  it('POST /users rejeita e-mail duplicado com 409', async () => {
    const payload = buildUserPayload();

    await request(app.getHttpServer()).post('/users').send(payload).expect(201);
    await request(app.getHttpServer()).post('/users').send(payload).expect(409);
  });

  it('POST /auth/login retorna 200 e accessToken', async () => {
    const credentials = buildUserPayload();
    await request(app.getHttpServer()).post('/users').send(credentials).expect(201);

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: credentials.email, password: credentials.password })
      .expect(200);

    expect(response.body.accessToken).toEqual(expect.any(String));
    expect(response.body).not.toHaveProperty('access_token');
    expect(response.body.user.email).toBe(credentials.email);
  });

  it('POST /auth/login rejeita senha errada com 401', async () => {
    const credentials = buildUserPayload();
    await request(app.getHttpServer()).post('/users').send(credentials).expect(201);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: credentials.email, password: 'wrong-password' })
      .expect(401);
  });

  it('GET /auth/me sem token retorna 401', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401);
  });

  it('GET /auth/me com token invalido retorna 401', async () => {
    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', 'Bearer invalid.token.value')
      .expect(401);
  });

  it('GET /auth/me com token retorna usuario autenticado', async () => {
    const { accessToken, user } = await registerAndLogin(app);

    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toMatchObject({
      userId: user.userId,
      email: user.email,
      role: user.role,
    });
  });
});
