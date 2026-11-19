import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Authentication required. Please login with mobile OTP.');
    }

    const user = await this.authService.validateSession(token);
    if (!user) {
      throw new UnauthorizedException('Session expired or invalid. Please login again.');
    }

    request.user = user;
    request.sessionToken = token;
    return true;
  }

  private extractToken(request: any): string | null {
    // 1. Check HTTP-only cookie
    if (request.cookies && request.cookies.unsulid_session) {
      return request.cookies.unsulid_session;
    }

    // 2. Check Bearer Authorization header
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // 3. Check x-session-token header
    if (request.headers['x-session-token']) {
      return request.headers['x-session-token'];
    }

    return null;
  }
}

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token =
      (request.cookies && request.cookies.unsulid_session) ||
      (request.headers['authorization']?.startsWith('Bearer ')
        ? request.headers['authorization'].substring(7)
        : null);

    if (token) {
      const user = await this.authService.validateSession(token);
      if (user) {
        request.user = user;
        request.sessionToken = token;
      }
    }

    return true;
  }
}

