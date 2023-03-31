import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { User } from '../../model/User';
import { Application } from '../../model/System/Application';
import { AuthModule } from '../auth/auth.module';
import { RegionAppHeadersCheckMiddleware } from '../auth/middleware/headers-check.middleware';
import { MeController } from './controller/me.controller';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from '../../config/jwt.config';
import { UserService } from './service/user.service';
import { UserLogin } from '../../model/UserLogin';
import { TokenService } from './service/token.service';
import { TokenController } from './controller/token.controller';
import { UserToken } from '../../model/UserToken';

@Module({
  imports: [
    //
    JwtModule.register({ secret: jwtConfig.SECRET }),
    MikroOrmModule.forFeature([Application, User, UserLogin, UserToken]),
    AuthModule,
  ],
  providers: [
    //
    UserService,
    TokenService,
  ],
  controllers: [
    //
    MeController,
    TokenController,
  ],
})
export class AppIamModule implements NestModule {
  private readonly logger = new Logger(AppIamModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.log('configure');

    consumer.apply(RegionAppHeadersCheckMiddleware).forRoutes(MeController);
  }
}
