import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

// Standardized error response format
export interface ErrorResponse {
  success: false;
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  error: {
    name: string;
    message: string | string[];
  };
}

/* @Catch(HttpException) means: We only handle HttpExceptions and all
those that inherit from them // (NotFoundException,
UnauthorizedException, BadRequestException, etc.)
*/
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    // -1- get the request and response from the context.
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // -2- get the exception status code.
    const statusCode = exception.getStatus();

    // -3- get the exception message.
    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as { message: string | string[] }).message;

    // -4- build the standardized error response.
    const errorResponse: ErrorResponse = {
      success: false,
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: {
        name: exception.name,
        message,
      },
    };

    // -5- log the error in the logger.
    this.logger.error(
      `${request.method} ${request.url} - ${statusCode} - ${JSON.stringify(message)}`,
    );

    // -6- send the standardized error response to the client.
    response.status(statusCode).json(errorResponse);
  }
}
