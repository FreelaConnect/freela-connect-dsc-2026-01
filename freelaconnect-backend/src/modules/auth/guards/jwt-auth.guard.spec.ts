import { UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '../services/jwt.service';
import { UserRole } from '../../users/enums/user-role.enum';

describe('JwtAuthGuard', () => {
  const demoEmail = 'demo-auth@example.com';

  const createContext = (request: Record<string, any>): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    }) as ExecutionContext;

  it('rejects requests without bearer token', () => {
    const guard = new JwtAuthGuard(new JwtService('test-secret', 3600));

    expect(() => guard.canActivate(createContext({ headers: {} }))).toThrow(
      UnauthorizedException,
    );
  });

  it('rejects requests with an invalid bearer token', () => {
    const guard = new JwtAuthGuard(new JwtService('test-secret', 3600));

    expect(() =>
      guard.canActivate(
        createContext({ headers: { authorization: 'Bearer token-falso' } }),
      ),
    ).toThrow(UnauthorizedException);
  });

  it('attaches the authenticated user to valid requests', () => {
    const jwtService = new JwtService('test-secret', 3600);
    const token = jwtService.sign({
      sub: 1,
      email: demoEmail,
      role: UserRole.ADMIN,
    });
    const request: {
      headers: { authorization: string };
      user?: Record<string, unknown>;
    } = {
      headers: { authorization: `Bearer ${token}` },
    };
    const guard = new JwtAuthGuard(jwtService);

    expect(guard.canActivate(createContext(request))).toBe(true);
    expect(request.user).toMatchObject({
      userId: 1,
      email: demoEmail,
      role: UserRole.ADMIN,
    });
  });
});
