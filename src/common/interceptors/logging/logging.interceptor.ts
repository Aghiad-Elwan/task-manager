import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  // Nest-integrated Logger - Better than console.log
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // -1- need to name the controller and the method.
    const className = context.getClass().name; // Example: UsersController
    const handlerName = context.getHandler().name; // Example: findAll

    // -2- need to log the start time.
    const startTime = Date.now();

    this.logger.log(`▶️  ${className}.${handlerName}() - START`);

    // -3- need to execute the controller method.
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.log(
          `✅ ${className}.${handlerName}() - END - ⏱️ ${duration}ms`,
        );
      }),
    );
  }
}
