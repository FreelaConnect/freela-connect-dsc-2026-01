import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { PaymentStatusEnum } from '../../src/common/enums/payment-status.enuns';
import { CreateContractDto } from '../../src/modules/contract/dto/create-contract.dto';
import { CreatePaymentDto } from '../../src/modules/payments/dto/create-payment.dto';
import { CreateProposalDto } from '../../src/modules/proposals/create-proposal.dto';
import { CreateUserDto } from '../../src/modules/users/dto/create-user.dto';
import { UserRole } from '../../src/modules/users/enums/user-role.enum';

setupTestEnvironment();

export type TestingApp = {
  app: INestApplication;
  moduleRef: TestingModule;
};

export async function createTestingApp(): Promise<TestingApp> {
  setupTestEnvironment();
  assertSafeTestDatabase();
  const { AppModule } = await import('../../src/app.module');

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  await app.init();

  return { app, moduleRef };
}

export async function createTestingModule(): Promise<TestingModule> {
  setupTestEnvironment();
  assertSafeTestDatabase();
  const { AppModule } = await import('../../src/app.module');

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  await moduleRef.init();
  return moduleRef;
}

export async function clearDatabase(
  moduleRef: TestingModule | INestApplication,
): Promise<void> {
  assertSafeTestDatabase();

  const dataSource = moduleRef.get(DataSource);
  await dataSource.query(
    'TRUNCATE TABLE "proposals", "payments", "contracts", "users" RESTART IDENTITY CASCADE',
  );
}

export function assertSafeTestDatabase(): void {
  const database = process.env.DB_DATABASE || '';
  if (process.env.NODE_ENV !== 'test' || !/(test|e2e)/i.test(database)) {
    throw new Error(
      `Refusing to run integration/e2e tests against non-test database "${database}". Set TEST_DB_DATABASE to a dedicated test database.`,
    );
  }
}

function setupTestEnvironment(): void {
  process.env.NODE_ENV = 'test';
  process.env.DB_HOST = process.env.TEST_DB_HOST || 'localhost';
  process.env.DB_PORT = process.env.TEST_DB_PORT || '5434';
  process.env.DB_USERNAME = process.env.TEST_DB_USERNAME || 'freelaconnect';
  process.env.DB_PASSWORD = process.env.TEST_DB_PASSWORD || 'freelaconnect';
  process.env.DB_DATABASE =
    process.env.TEST_DB_DATABASE || 'freelaconnect_test';
  process.env.JWT_SECRET =
    process.env.JWT_SECRET || 'freelaconnect-test-secret';
}

export function uniqueId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function buildUserPayload(
  overrides: Partial<CreateUserDto> = {},
): CreateUserDto {
  const id = uniqueId('user');
  return {
    name: 'Test User',
    email: `${id}@example.com`,
    password: 'password123',
    role: UserRole.CLIENT,
    ...overrides,
  };
}

export function buildContractPayload(
  overrides: Partial<CreateContractDto> = {},
): CreateContractDto {
  const id = uniqueId('contract');
  return {
    freelancerId: `${id}-freelancer`,
    orderId: `${id}-order`,
    projectId: `${id}-project`,
    status: PaymentStatusEnum.PENDING,
    ...overrides,
  };
}

export function buildProposalPayload(
  overrides: Partial<CreateProposalDto> = {},
): CreateProposalDto {
  const id = uniqueId('proposal');
  return {
    projectId: `${id}-project`,
    freelancerId: `${id}-freelancer`,
    coverLetter: 'Tenho experiencia para entregar esta demanda com qualidade.',
    proposedValue: 1500,
    estimatedDeadline: '2026-07-01',
    ...overrides,
  };
}

export function buildPaymentPayload(
  overrides: Partial<CreatePaymentDto> = {},
): CreatePaymentDto {
  return {
    ordemId: uniqueId('order'),
    amount: 1500,
    status: PaymentStatusEnum.PENDING,
    ...overrides,
  };
}

export async function registerAndLogin(
  app: INestApplication,
  overrides: Partial<CreateUserDto> = {},
): Promise<{ accessToken: string; user: any; credentials: CreateUserDto }> {
  const credentials = buildUserPayload(overrides);

  await request(app.getHttpServer())
    .post('/users')
    .send(credentials)
    .expect(201);
  const loginResponse = await request(app.getHttpServer())
    .post('/auth/login')
    .send({
      email: credentials.email,
      password: credentials.password,
    })
    .expect(200);

  return {
    accessToken: loginResponse.body.accessToken,
    user: loginResponse.body.user,
    credentials,
  };
}
