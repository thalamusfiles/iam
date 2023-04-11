import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { User } from '../../model/User';
import { Role } from '../../model/Role';
import { Permission } from '../../model/Permission';
import { Application } from '../../model/System/Application';
import { AuthModule } from '../auth/auth.module';
import { ApplicationService } from './service/application.service';
import { RoleService } from './service/role.service';
import { PermissionService } from './service/permission.service';
import { UserService } from './service/user.service';
import { ApplicationController } from './controller/application.controller';
import { RoleController } from './controller/role.controller';
import { PermissionController } from './controller/permission.controller';
import { UserController } from './controller/user.controller';
import { GlobalIamHeadersCheckMiddleware, AppHeadersCheckMiddleware } from '../auth/middleware/headers-check.middleware';
import { UseCaseMGTService } from './service/usecasemgt.service';

@Module({
  imports: [
    //
    AuthModule,
    MikroOrmModule.forFeature([Application, User, Role, Permission]),
  ],
  providers: [
    //
    UseCaseMGTService,
    ApplicationService,
    UserService,
    RoleService,
    PermissionService,
  ],
  controllers: [
    //
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

    consumer.apply(GlobalIamHeadersCheckMiddleware).forRoutes(ApplicationController);
    consumer.apply(AppHeadersCheckMiddleware).forRoutes(UserController, RoleController, PermissionController);
  }
}
