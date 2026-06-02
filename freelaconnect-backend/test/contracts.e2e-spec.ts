import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('ContractsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/contracts (GET) - should return paginated contracts', () => {
    return request(app.getHttpServer())
      .get('/contracts')
      .expect(200)
      .expect((res: any) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('page');
        expect(res.body).toHaveProperty('limit');
        expect(res.body).toHaveProperty('total');
        expect(res.body).toHaveProperty('totalPages');
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  it('/contracts (GET) - should support pagination parameters', () => {
    return request(app.getHttpServer())
      .get('/contracts?page=1&limit=5')
      .expect(200)
      .expect((res: any) => {
        expect(res.body.page).toBe(1);
        expect(res.body.limit).toBe(5);
      });
  });
});

