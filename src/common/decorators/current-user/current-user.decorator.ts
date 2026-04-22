import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../../users/interfaces/user.interface';

// same interface we used in AuthGuard
interface AuthenticatedRequest extends Request {
  user?: User;
}

/**
 * Custom Decorator to fetch the current user from the request
 * Usage:
 * @CurrentUser() user: User
 * Requirement: AuthGuard must be present on the route
 * (Because the AuthGuard is what places the user on the request)
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User | undefined => {
    // get the request from the context
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

    //restore the user (the one that AuthGuard set up)
    return request.user;
  },
);
