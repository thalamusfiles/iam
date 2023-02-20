import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { User } from '../../model/User';
import { JWTStrategy } from './jwt/jwt.strategy';
import { AuthService } from './service/auth.service';

@Module({
  imports: [PassportModule, , MikroOrmModule.forFeature([User])],
  providers: [JWTStrategy, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
