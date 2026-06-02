import { ForbiddenException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { UserRole } from '../../users/enums/user-role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

describe('RolesGuard', () => {
  const handler = jest.fn();
  const context = (user?: Record<string, any>): ExecutionContext =>
    ({
      getHandler: () => handler,
      getClass: () => class TestController {},
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    }) as unknown as ExecutionContext;

  it('allows requests when no roles are required', () => {
    const reflector = new Reflector();
    const guard = new RolesGuard(reflector);

    expect(guard.canActivate(context({ role: UserRole.CLIENT }))).toBe(true);
  });

  it('allows users with required role', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue([UserRole.ADMIN]),
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);

    expect(guard.canActivate(context({ role: UserRole.ADMIN }))).toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
      handler,
      expect.any(Function),
    ]);
  });

  it('rejects users without required role', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue([UserRole.ADMIN]),
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);

    expect(() => guard.canActivate(context({ role: UserRole.CLIENT }))).toThrow(ForbiddenException);
  });
});
