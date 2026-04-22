import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../../../users/users.service';

//  add a type to the Request so we can add a user to it.
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
    createdAt: Date;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  canActivate(context: ExecutionContext): boolean {
    //  Get the request from context
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    //  Get the header from request
    const userIdHeader = request.headers['x-user-id'];

    //  check that the header is present.
    if (!userIdHeader) {
      throw new UnauthorizedException('يجب إرسال header اسمه x-user-id');
    }

    //  Convert the header to number
    const userId = parseInt(userIdHeader as string, 10);

    //  check that the number is valid.
    if (isNaN(userId)) {
      throw new UnauthorizedException('x-user-id لازم يكون رقم');
    }

    //  search for the user
    try {
      const user = this.usersService.findOne(userId);

      //  add the user to the request
      // This way, any subsequent code (Controller, Interceptor) can access it
      request.user = user;

      //  allow the request to continue
      return true;
    } catch {
      throw new UnauthorizedException('المستخدم غير موجود');
    }
  }
}
