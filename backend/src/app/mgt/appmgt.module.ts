import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { Application } from '../../model/System/Application';
import { Region } from '../../model/System/Region';
import { User } from '../../model/User';
import { AuthModule } from '../auth/auth.module';
import { ApplicationController } from './controller/application.controller';
import { RegionController } from './controller/region.controller';
import { UserController } from './controller/user.controller';
import { GlobalIamHeadersCheckMiddleware, RegionAppHeadersCheckMiddleware } from './middleware/headers-check.middleware';
import { ApplicationService } from './service/application.service';
import { RegionService } from './service/region.service';
import { UseCaseMgtModule } from './usecases/usecasemgt.module';

@Module({
  imports: [AuthModule, UseCaseMgtModule, MikroOrmModule.forFeature([Region, Application, User])],
  controllers: [RegionController, ApplicationController, UserController],
  providers: [RegionService, ApplicationService],
})
export class AppMgtModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GlobalIamHeadersCheckMiddleware).forRoutes(RegionController, ApplicationController);
    consumer.apply(RegionAppHeadersCheckMiddleware).forRoutes(UserController);
  }
}
