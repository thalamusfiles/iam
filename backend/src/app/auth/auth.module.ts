import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { User } from '../../model/User';
import { UserLogin } from '../../model/UserLogin';
import { Application } from '../../model/System/Application';
import jwtConfig from '../../config/jwt.config';
import { JWTStrategy } from './jwt/jwt.strategy';
import { AuthService } from './service/auth.service';
import { RequestService } from './service/request.service';
import { AuthController } from './controller/auth.controller';
import { RegionAppHeadersCheckMiddleware } from './middleware/headers-check.middleware';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UserToken } from '../../model/UserToken';

@Module({
  imports: [
    //
    PassportModule.register({ session: true }),
    JwtModule.register({ secret: jwtConfig.SECRET }),
    ThrottlerModule.forRoot(/*{ limit: iamConfig.REGISTER_RATE_LIMITE, ttl: iamConfig.REGISTER_RATE_LIMITE_REST_TIME }*/),
    MikroOrmModule.forFeature([Application, User, UserLogin, UserToken]),
  ],
  providers: [
    AuthService,
    RequestService,
    JWTStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [AuthService, RequestService],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RegionAppHeadersCheckMiddleware).forRoutes(AuthController);
  }
}
