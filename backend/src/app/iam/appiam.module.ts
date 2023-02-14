import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LoginController } from './controller/login.crontroller';
import { MeController } from './controller/me.controller';
import { JWTStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [PassportModule],
  providers: [JWTStrategy],
  controllers: [LoginController, MeController],
})
export class AppIamModule {}
