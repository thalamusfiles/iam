import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import createNestLogger from './app/logger/create-logger';
import * as cookieParser from 'cookie-parser';
import iamConfig from './config/iam.config';
import { NotFoundExceptionFilter } from './commons/catch.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: createNestLogger(),
  });

  // Parser de coockie
  app.use(cookieParser());

  // Habilita o cors para uso local da ferramente
  if (!iamConfig.PRODCTION_MODE) {
    app.enableCors();
  }

  // Filtro de exceção do ORM
  app.useGlobalFilters(new NotFoundExceptionFilter());

  await app.listen(iamConfig.PORT);
}
bootstrap();
