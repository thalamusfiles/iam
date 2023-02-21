import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import jwtConfig from '../../config/jwt.config';
import { User } from '../../model/User';
import { UserLogin } from '../../model/UserLogin';
import { JWTStrategy } from './jwt/jwt.strategy';
import { AuthService } from './service/auth.service';

@Module({
  imports: [
    PassportModule,
    MikroOrmModule.forFeature([User, UserLogin]),
    JwtModule.register({
      secret: jwtConfig.SECRET,
    }),
  ],
  providers: [JWTStrategy, JwtService, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
