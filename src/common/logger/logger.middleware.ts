import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now(); //Record start time

    const method = req.method;
    const originalUrl = req.originalUrl;
    const body = req.body as Record<string, unknown> | undefined;

    const timestamp = new Date().toISOString(); // Create timestamp

    console.log(`📥 [${timestamp}] ${method} ${originalUrl}`); // Print request

    if (body && typeof body === 'object' && Object.keys(body).length > 0) {
      console.log(`   Body: ${JSON.stringify(body)}`);
    }

    //Recording the event on the response
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const { statusCode } = res;

      const statusEmoji = statusCode < 400 ? '✅' : '❌';

      console.log(
        `📤 ${statusEmoji} [${timestamp}] ${method} ${originalUrl} - ${statusCode} - ⏱️ ${duration}ms`,
      );
      console.log('─'.repeat(50));
    });

    next();
  }
}
