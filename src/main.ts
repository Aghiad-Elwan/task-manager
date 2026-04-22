import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes any fields not in the DTO class
      forbidNonWhitelisted: true, // It throws an error if there are extra fields
      transform: true, // Converts data to match DTO types
    }),
  );

  // The order is important! LoggingInterceptor first (works before conversion)
  // Activate the Interceptor Globally
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );
  // Activate the Filter Globally
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
