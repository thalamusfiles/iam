import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JWTStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [PassportModule],
  providers: [JWTStrategy],
})
export class AuthModule {}
