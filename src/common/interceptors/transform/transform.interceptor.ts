import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, map } from 'rxjs';

// The shape of the unified response.
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    // -1- We get the request and response from the context.
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<{ statusCode: number }>();

    // -2- We execute the Controller and get the Observable.
    return next.handle().pipe(
      // -3- We map the Observable to the ApiResponse.
      map((data: T) => ({
        success: true,
        statusCode: response.statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
        data, // ← Here are the original data from the Controller.
      })),
    );
  }
}
