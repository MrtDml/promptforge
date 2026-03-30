import './instrument';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import * as express from 'express';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  // iyzico webhook: form-data (urlencoded) gönderir
  // Diğer route'lar: JSON
  app.use(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      if (req.path === '/api/v1/stripe/webhook') {
        express.urlencoded({ extended: true })(req, res, next);
      } else {
        express.json()(req, res, next);
      }
    },
  );

  // Webhook dışındaki route'lar için urlencoded da destekle
  app.use(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      if (req.path !== '/api/v1/stripe/webhook') {
        express.urlencoded({ extended: true })(req, res, next);
      } else {
        next();
      }
    },
  );

  // Global prefix (/health endpoint hariç)
  app.setGlobalPrefix('api/v1', { exclude: ['health'] });

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`PromptForge backend çalışıyor: http://localhost:${port}/api/v1`);
}

bootstrap();
