import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './services/auth.service';
import { JwtService } from './services/jwt.service';
import { USERS_REPOSITORY, UsersRepository } from '../users/repositories/users.repository.interface';
import { PasswordService } from '../users/services/password.service';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/services/users.service';
import { UserEntity } from '../users/entities/user.entity';
import { UserRole } from '../users/enums/user-role.enum';
import { UserStatus } from '../users/enums/user-status.enum';

describe('Auth flow', () => {
  let app: INestApplication;

  const demoUser = {
    name: 'Demo Auth',
    email: 'demo-auth@example.com',
    password: 'password123',
    role: UserRole.ADMIN,
  };

  const createRepository = (): UsersRepository => {
    const users = new Map<number, UserEntity>();
    let nextId = 1;

    const findVisibleUser = (predicate: (user: UserEntity) => boolean): UserEntity | null => {
      const user = Array.from(users.values()).find(predicate);
      return user && !user.deletedAt ? user : null;
    };

    return {
      findById: async (userId) => users.get(userId) ?? null,
      findByEmail: async (email) => findVisibleUser((user) => user.email === email),
      findByPasswordResetTokenHash: async (passwordResetTokenHash) =>
        findVisibleUser((user) => user.passwordResetTokenHash === passwordResetTokenHash),
      findAll: async (page = 1, limit = 10) => {
        const data = Array.from(users.values()).filter((user) => !user.deletedAt);
        const start = (page - 1) * limit;
        return { data: data.slice(start, start + limit), total: data.length };
      },
      save: async (user) => {
        const now = new Date('2026-06-01T00:00:00.000Z');
        const stored = Object.assign(user, {
          userId: nextId++,
          status: user.status ?? UserStatus.ACTIVE,
          version: user.version ?? 1,
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
        });

        users.set(stored.userId, stored);
        return stored;
      },
      update: async (userId, data) => {
        const user = users.get(userId);
        if (!user) {
          return null;
        }

        Object.assign(user, data, {
          updatedAt: new Date('2026-06-02T00:00:00.000Z'),
        });
        if (typeof data.version === 'number') {
          user.version = data.version + 1;
        }

        return user;
      },
      delete: async (userId) => {
        const user = users.get(userId);
        if (!user) {
          return false;
        }

        user.deletedAt = new Date('2026-06-03T00:00:00.000Z');
        return true;
      },
    };
  };

  const buildApp = async (): Promise<INestApplication> => {
    const repository = createRepository();

    const module = await Test.createTestingModule({
      controllers: [UsersController, AuthController],
      providers: [
        UsersService,
        AuthService,
        PasswordService,
        JwtService,
        JwtAuthGuard,
        { provide: USERS_REPOSITORY, useValue: repository },
      ],
    }).compile();

    const appInstance = module.createNestApplication();
    await appInstance.init();

    return appInstance;
  };

  beforeEach(async () => {
    app = await buildApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it('creates a user for the auth demo', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(demoUser)
      .expect(201);

    expect(response.body).toMatchObject({
      userId: 1,
      name: 'Demo Auth',
      email: 'demo-auth@example.com',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      version: 1,
    });
    expect(response.body).not.toHaveProperty('passwordHash');
  });

  it('rejects login with invalid credentials', async () => {
    await request(app.getHttpServer()).post('/users').send(demoUser).expect(201);

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: demoUser.email,
        password: 'senha-errada',
      })
      .expect(401);

    expect(response.body).toMatchObject({
      statusCode: 401,
      message: 'Credenciais invalidas',
    });
  });

  it('logs in successfully and returns an access token', async () => {
    await request(app.getHttpServer()).post('/users').send(demoUser).expect(201);

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: demoUser.email,
        password: demoUser.password,
      })
      .expect(200);

    expect(response.body.accessToken).toBeDefined();
    expect(response.body.user).toMatchObject({
      userId: 1,
      email: demoUser.email,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    });
  });

  it('rejects the protected route without a token', async () => {
    const response = await request(app.getHttpServer()).get('/auth/me').expect(401);

    expect(response.body).toMatchObject({
      statusCode: 401,
      message: 'Token nao informado',
    });
  });

  it('rejects the protected route with an invalid token', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', 'Bearer token-falso')
      .expect(401);

    expect(response.body).toMatchObject({
      statusCode: 401,
      message: 'Token invalido',
    });
  });

  it('returns the current user with a valid token', async () => {
    await request(app.getHttpServer()).post('/users').send(demoUser).expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: demoUser.email,
        password: demoUser.password,
      })
      .expect(200);

    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
      .expect(200);

    expect(response.body).toMatchObject({
      userId: 1,
      name: demoUser.name,
      email: demoUser.email,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    });
  });

  it('resets a password with a recovery token', async () => {
    await request(app.getHttpServer()).post('/users').send(demoUser).expect(201);

    const recoveryResponse = await request(app.getHttpServer())
      .post('/auth/forgot-password')
      .send({ email: demoUser.email })
      .expect(200);

    expect(recoveryResponse.body.message).toBe(
      'Se o e-mail estiver cadastrado, enviaremos as instrucoes de recuperacao.',
    );
    expect(recoveryResponse.body.resetToken).toBeDefined();

    await request(app.getHttpServer())
      .post('/auth/reset-password')
      .send({
        token: recoveryResponse.body.resetToken,
        password: 'nova-senha-123',
      })
      .expect(200);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: demoUser.email,
        password: demoUser.password,
      })
      .expect(401);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: demoUser.email,
        password: 'nova-senha-123',
      })
      .expect(200);
  });
});
