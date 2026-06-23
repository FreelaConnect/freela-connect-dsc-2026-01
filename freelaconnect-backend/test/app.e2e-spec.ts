import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { clearDatabase, createTestingApp, TestingApp } from './helpers/test-app';

describe('AppController (e2e)', () => {
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

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
