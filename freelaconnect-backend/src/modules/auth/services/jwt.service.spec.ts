import { JwtService } from './jwt.service';
import { UserRole } from '../../users/enums/user-role.enum';

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(() => {
    service = new JwtService('test-secret', 3600);
  });

  it('signs and verifies access tokens', () => {
    const token = service.sign({
      sub: 1,
      email: 'admin@example.com',
      role: UserRole.ADMIN,
    });

    expect(service.verify(token)).toMatchObject({
      sub: 1,
      email: 'admin@example.com',
      role: UserRole.ADMIN,
    });
  });

  it('rejects invalid tokens', () => {
    expect(() => service.verify('invalid.token.value')).toThrow();
  });
});
