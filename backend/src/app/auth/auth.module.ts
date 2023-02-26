import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import jwtConfig from '../../config/jwt.config';
import { RegionAppHeadersCheckMiddleware } from '../mgt/middleware/headers-check.middleware';
import { User } from '../../model/User';
import { UserLogin } from '../../model/UserLogin';
import { JWTStrategy } from './jwt/jwt.strategy';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';

@Module({
  imports: [
    //
    PassportModule,
    JwtModule.register({ secret: jwtConfig.SECRET }),
    MikroOrmModule.forFeature([User, UserLogin]),
  ],
  controllers: [AuthController],
  providers: [JWTStrategy, JwtService, AuthService],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RegionAppHeadersCheckMiddleware).forRoutes(AuthController);
  }
}
