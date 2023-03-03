import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { User } from '../../model/User';
import { Role } from '../../model/Role';
import { Region } from '../../model/System/Region';
import { Application } from '../../model/System/Application';
import { AuthModule } from '../auth/auth.module';
import { UseCaseMgtModule } from './usecase/usecasemgt.module';
import { ApplicationService } from './service/application.service';
import { RegionService } from './service/region.service';
import { RoleService } from './service/role.service';
import { UserService } from './service/user.service';
import { ApplicationController } from './controller/application.controller';
import { RegionController } from './controller/region.controller';
import { RoleController } from './controller/role.controller';
import { UserController } from './controller/user.controller';
import { GlobalIamHeadersCheckMiddleware, RegionAppHeadersCheckMiddleware } from '../auth/middleware/headers-check.middleware';

@Module({
  imports: [
    //
    AuthModule,
    UseCaseMgtModule,
    MikroOrmModule.forFeature([Region, Application, User, Role]),
  ],
  providers: [RegionService, ApplicationService, UserService, RoleService],
  controllers: [
    //
    RegionController,
    ApplicationController,
    UserController,
    RoleController,
  ],
})
export class AppMgtModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GlobalIamHeadersCheckMiddleware).forRoutes(RegionController, ApplicationController);
    consumer.apply(RegionAppHeadersCheckMiddleware).forRoutes(UserController, RoleController);
  }
}
