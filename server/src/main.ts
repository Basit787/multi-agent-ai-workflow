import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { toNodeHandler } from 'better-auth/node';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import { auth } from './auth/utils/auth.js';
import { HttpExceptionFilter } from './common/http-exception.filter.js';
import { validationPipe } from './common/validation.pipe.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });
  app.setGlobalPrefix('api');
  app.use(helmet());

  app
    .getHttpAdapter()
    .getInstance()
    .all('/api/auth/{*path}', toNodeHandler(auth));
  app.useBodyParser('json');

  app.useGlobalPipes(validationPipe);
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port);
  new Logger('Bootstrap').log(`Server on http://localhost:${port}/api`);
}

bootstrap();
