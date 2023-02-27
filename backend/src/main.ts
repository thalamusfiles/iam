import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import createNestLogger from './app/logger/create-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: createNestLogger(),
  });
  await app.listen(3000);
}
bootstrap();
