import { Module } from '@nestjs/common';
import { LoginController } from './controller/login.crontroller';
import { MeController } from './controller/me.controller';

@Module({
  controllers: [LoginController, MeController],
})
export class AppIamModule {}
