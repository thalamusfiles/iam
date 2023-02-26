import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RegionAppHeadersCheckMiddleware } from '../mgt/middleware/headers-check.middleware';
import { MeController } from './controller/me.controller';

@Module({
  imports: [AuthModule],
  controllers: [MeController],
})
export class AppIamModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RegionAppHeadersCheckMiddleware).forRoutes(MeController);
  }
}
