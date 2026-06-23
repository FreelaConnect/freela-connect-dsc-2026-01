import { Inject, Injectable, Optional, UnauthorizedException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { UserRole } from '../../users/enums/user-role.enum';

export type JwtPayload = {
  sub: number;
  email: string;
  role: UserRole;
  exp?: number;
};

@Injectable()
export class JwtService {
  private readonly secret: string;
  private readonly expiresInSeconds: number;

  constructor(
    @Optional() @Inject('JWT_SECRET') secret?: string,
    @Optional() @Inject('JWT_EXPIRES_IN_SECONDS') expiresInSeconds?: number,
  ) {
    this.secret = secret || process.env.JWT_SECRET || 'freelaconnect-dev-secret';
    this.expiresInSeconds = expiresInSeconds ?? Number(process.env.JWT_EXPIRES_IN_SECONDS || 3600);
  }

  sign(payload: Omit<JwtPayload, 'exp'>): string {
    const header = this.encode({ alg: 'HS256', typ: 'JWT' });
    const body = this.encode({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + this.expiresInSeconds,
    });
    const signature = this.signParts(header, body);

    return `${header}.${body}.${signature}`;
  }

  verify(token: string): JwtPayload {
    const [header, body, signature] = token.split('.');
    if (!header || !body || !signature) {
      throw new UnauthorizedException('Token invalido');
    }

    const expectedSignature = this.signParts(header, body);
    const signatureBuffer = Buffer.from(signature);
    const expectedSignatureBuffer = Buffer.from(expectedSignature);

    if (
      signatureBuffer.length !== expectedSignatureBuffer.length ||
      !timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
    ) {
      throw new UnauthorizedException('Token invalido');
    }

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as JwtPayload;
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Token expirado');
    }

    return payload;
  }

  private signParts(header: string, body: string): string {
    return createHmac('sha256', this.secret).update(`${header}.${body}`).digest('base64url');
  }

  private encode(value: Record<string, unknown>): string {
    return Buffer.from(JSON.stringify(value)).toString('base64url');
  }
}
