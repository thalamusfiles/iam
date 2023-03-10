import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { User } from '../../model/User';
import { Role } from '../../model/Role';
import { Permission } from '../../model/Permission';
import { Region } from '../../model/System/Region';
import { Application } from '../../model/System/Application';
import { AuthModule } from '../auth/auth.module';
import { ApplicationService } from './service/application.service';
import { RegionService } from './service/region.service';
import { RoleService } from './service/role.service';
import { PermissionService } from './service/permission.service';
import { UserService } from './service/user.service';
import { ApplicationController } from './controller/application.controller';
import { RegionController } from './controller/region.controller';
import { RoleController } from './controller/role.controller';
import { PermissionController } from './controller/permission.controller';
import { UserController } from './controller/user.controller';
import { GlobalIamHeadersCheckMiddleware, RegionAppHeadersCheckMiddleware } from '../auth/middleware/headers-check.middleware';
import { UseCaseMGTService } from './service/usecasemgt.service';

@Module({
  imports: [
    //
    AuthModule,
    MikroOrmModule.forFeature([Region, Application, User, Role, Permission]),
  ],
  providers: [
    //
    UseCaseMGTService,
    RegionService,
    ApplicationService,
    UserService,
    RoleService,
    PermissionService,
  ],
  controllers: [
    //
    RegionController,
    ApplicationController,
    UserController,
    RoleController,
    PermissionController,
  ],
})
export class AppMgtModule implements NestModule {
  private readonly logger = new Logger(AppMgtModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.log('configure');

    consumer.apply(GlobalIamHeadersCheckMiddleware).forRoutes(RegionController, ApplicationController);
    consumer.apply(RegionAppHeadersCheckMiddleware).forRoutes(UserController, RoleController, PermissionController);
  }
}
