import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Application } from '../../model/System/Application';
import { Region } from '../../model/System/Region';
import { User } from '../../model/User';
import { ApplicationController } from './controller/application.controller';
import { RegionController } from './controller/region.controller';
import { UserController } from './controller/user.controller';
import { RegionService } from './service/region.service';

@Module({
  imports: [MikroOrmModule.forFeature([Region, Application, User])],
  controllers: [RegionController, ApplicationController, UserController],
  providers: [RegionService],
})
export class AppMgtModule {}
