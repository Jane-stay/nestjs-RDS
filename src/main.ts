import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as csurf from 'csurf';
import * as cookie from 'cookie-parser';
import helmet from 'helmet';
import { WinstonLoggerService } from './modules/logger/winston-logger.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { LoggingMiddleware } from './common/middlewares/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new WinstonLoggerService();

  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(
    ['/docs'],
    basicAuth({
      users: { admin: 'pw123' },
      challenge: false,
      unauthorizedResponse: () => 'Unauthorized',
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('test api 문서')
    .setDescription('For test API')
    .setVersion('0.1')
    .addBearerAuth()
    // .addBearerAuth({ type: 'http' }, 'admin') //나중에
    .addServer('/api/v1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const corsOption = {
    allowHeaders: ['Accept', 'Content-Type', 'Origin', 'Authorization'],
    origin: [
      'http://localhost:8000',
      'http://localhost:8080',
      'http:0.0.0.0:8000',
      'http:127.0.0.1:8000',
    ],
    credential: true,
  };

  app.enableCors(corsOption);
  app.use(cookie());
  // app.use(csurf({ cookie: true }));
  app.use(helmet());
  app.setGlobalPrefix('/api/v1', {
    exclude: ['health'],
  });
  app.use(new LoggingMiddleware().use);
  app.useLogger(logger);

  const port = configService.get<number>('PORT') || 3000;
  logger.log('Application is starting...스타트');
  await app.listen(port);
}
bootstrap();
