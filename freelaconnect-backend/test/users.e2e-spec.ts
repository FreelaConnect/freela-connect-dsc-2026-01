import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UserRole } from '../src/modules/users/enums/user-role.enum';
import { UserStatus } from '../src/modules/users/enums/user-status.enum';
import {
  buildUserPayload,
  clearDatabase,
  createTestingApp,
  TestingApp,
} from './helpers/test-app';

describe('UsersController (e2e)', () => {
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

  async function createUser(overrides = {}) {
    const payload = buildUserPayload(overrides);
    const response = await request(app.getHttpServer()).post('/users').send(payload).expect(201);
    return response.body;
  }

  it('GET /users retorna objeto paginado', async () => {
    await createUser();

    const response = await request(app.getHttpServer()).get('/users').expect(200);

    expect(response.body).toMatchObject({
      data: expect.any(Array),
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    });
  });

  it('GET /users?page=1&limit=5 respeita paginacao', async () => {
    await Promise.all([createUser(), createUser(), createUser(), createUser(), createUser(), createUser()]);

    const response = await request(app.getHttpServer()).get('/users?page=1&limit=5').expect(200);

    expect(response.body.page).toBe(1);
    expect(response.body.limit).toBe(5);
    expect(response.body.data).toHaveLength(5);
    expect(response.body.total).toBe(6);
  });

  it('GET /users/:id retorna usuario existente', async () => {
    const user = await createUser();

    const response = await request(app.getHttpServer()).get(`/users/${user.userId}`).expect(200);

    expect(response.body).toMatchObject({
      userId: user.userId,
      email: user.email,
    });
  });

  it('PATCH /users/:id atualiza parcialmente', async () => {
    const user = await createUser();

    const response = await request(app.getHttpServer())
      .patch(`/users/${user.userId}`)
      .send({ version: user.version, name: 'Usuario Atualizado' })
      .expect(200);

    expect(response.body).toMatchObject({
      userId: user.userId,
      name: 'Usuario Atualizado',
      version: user.version + 1,
    });
  });

  it('PUT /users/:id substitui dados', async () => {
    const user = await createUser();
    const replacePayload = buildUserPayload({
      name: 'Usuario Substituido',
      role: UserRole.FREELANCER,
    });

    const response = await request(app.getHttpServer())
      .put(`/users/${user.userId}`)
      .send({
        version: user.version,
        name: replacePayload.name,
        email: replacePayload.email,
        password: replacePayload.password,
        role: replacePayload.role,
        status: UserStatus.ACTIVE,
      })
      .expect(200);

    expect(response.body).toMatchObject({
      userId: user.userId,
      name: 'Usuario Substituido',
      email: replacePayload.email,
      role: UserRole.FREELANCER,
      version: user.version + 1,
    });
  });

  it('DELETE /users/:id remove usando version', async () => {
    const user = await createUser();

    await request(app.getHttpServer())
      .delete(`/users/${user.userId}`)
      .send({ version: user.version })
      .expect(200);

    await request(app.getHttpServer()).get(`/users/${user.userId}`).expect(404);
  });
});
