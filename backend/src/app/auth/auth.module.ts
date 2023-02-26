import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import jwtConfig from '../../config/jwt.config';
import { RegionAppHeadersCheckMiddleware } from '../mgt/middleware/headers-check.middleware';
import { User } from '../../model/User';
import { UserLogin } from '../../model/UserLogin';
import { JWTStrategy } from './jwt/jwt.strategy';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    //
    PassportModule,
    JwtModule.register({ secret: jwtConfig.SECRET }),
    ThrottlerModule.forRoot(/*{ limit: iamConfig.REGISTER_RATE_LIMITE, ttl: iamConfig.REGISTER_RATE_LIMITE_REST_TIME }*/),
    MikroOrmModule.forFeature([User, UserLogin]),
  ],
  providers: [
    AuthService,
    JWTStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RegionAppHeadersCheckMiddleware).forRoutes(AuthController);
  }
}
