import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DbStoreService } from '@/database/db-store.service';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly store: DbStoreService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Admin authentication required');
    }

    // Verify session
    const session = this.store.sessions.find((s) => s.token === token);
    if (!session) {
      throw new UnauthorizedException('Invalid or expired admin session');
    }

    const admin = this.store.adminUsers.find((a) => a.id === session.userId && a.isActive);
    if (!admin) {
      throw new UnauthorizedException('Admin user not found or deactivated');
    }

    request.admin = admin;

    // Check Role permissions
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Super Admin has all privileges
    if (admin.role === 'SUPER_ADMIN') {
      return true;
    }

    if (!requiredRoles.includes(admin.role)) {
      throw new ForbiddenException(
        `Access denied. Role '${admin.role}' lacks permission for this action.`
      );
    }

    return true;
  }

  private extractToken(request: any): string | null {
    if (request.cookies && request.cookies.unsulid_admin_token) {
      return request.cookies.unsulid_admin_token;
    }

    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    if (request.headers['x-admin-token']) {
      return request.headers['x-admin-token'];
    }

    if (request.headers['x-session-token']) {
      return request.headers['x-session-token'];
    }

    return null;
  }
}

