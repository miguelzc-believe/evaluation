import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { PrismaKnownRequestExceptionFilter, PrismaValidationExceptionFilter, GlobalExceptionFilter } from './exercises/exercise6/exception.filter';
import { TransformInterceptor } from './exercises/exercise7/transform.interceptor';
import { AuthGuard } from './exercises/exercise8/auth.guard';
import { LoggerMiddleware } from './exercises/exercise9/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar pipes globales
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configurar filtros de excepción globales
  app.useGlobalFilters(
    new PrismaKnownRequestExceptionFilter(),
    new PrismaValidationExceptionFilter(),
    new GlobalExceptionFilter(),
  );

  // Configurar interceptor global
  app.useGlobalInterceptors(new TransformInterceptor());

  // Configurar guard global
  app.useGlobalGuards(new AuthGuard(app.get('Reflector')));

  // Configurar middleware global
  app.use(LoggerMiddleware);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
