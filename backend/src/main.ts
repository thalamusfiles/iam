import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import createNestLogger from './app/logger/create-logger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: createNestLogger(),
  });

  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
