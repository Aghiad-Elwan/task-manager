import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from '../../decorators/roles/roles.decorator';
import type { User } from '../../../users/interfaces/user.interface';

// The same interface used in AuthGuard
interface AuthenticatedRequest extends Request {
  user?: User;
}

@Injectable()
export class RolesGuard implements CanActivate {
  // Reflector = Nest tool for reading metadata
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // -1- Read roles from decorator metadata
    const requiredRoles = this.reflector.getAllAndOverride<
      Array<'admin' | 'user'>
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);

    // -2- If no roles specified, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // -3- Get user from request (AuthGuard sets it)
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    // -4- If there is no user, it means AuthGuard has not worked before.
    if (!user) {
      throw new ForbiddenException('يجب تفعيل AuthGuard قبل RolesGuard');
    }

    // -5- Check if the user's role is among the required roles.
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        `هاد الـ route مسموح فقط لـ: ${requiredRoles.join(', ')}`,
      );
    }

    // -6- Allow access
    return true;
  }
}
