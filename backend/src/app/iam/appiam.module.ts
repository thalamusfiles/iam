import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RegionAppHeadersCheckMiddleware } from '../mgt/middleware/headers-check.middleware';
import { AuthController } from './controller/auth.crontroller';
import { MeController } from './controller/me.controller';

@Module({
  controllers: [AuthController, MeController],
})
export class AppIamModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RegionAppHeadersCheckMiddleware).forRoutes(AuthController, MeController);
  }
}
