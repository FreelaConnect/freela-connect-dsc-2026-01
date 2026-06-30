import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedUser } from '../types/authenticated-user';
import { JwtService } from '../services/jwt.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | undefined>;
      user?: AuthenticatedUser;
    }>();
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token nao informado');
    }

    const payload = this.jwtService.verify(
      authorization.replace('Bearer ', ''),
    );
    request.user = {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    return true;
  }
}
