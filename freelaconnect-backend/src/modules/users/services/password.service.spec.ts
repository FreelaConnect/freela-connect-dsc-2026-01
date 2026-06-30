import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(() => {
    service = new PasswordService();
  });

  it('hashes passwords without returning the plain text password', async () => {
    const hash = await service.hashPassword('password123');

    expect(hash).not.toBe('password123');
    expect(hash).toContain(':');
  });

  it('matches valid passwords against their hashes', async () => {
    const hash = await service.hashPassword('password123');

    await expect(service.comparePassword('password123', hash)).resolves.toBe(
      true,
    );
  });

  it('rejects invalid passwords against their hashes', async () => {
    const hash = await service.hashPassword('password123');

    await expect(service.comparePassword('wrong-password', hash)).resolves.toBe(
      false,
    );
  });
});
