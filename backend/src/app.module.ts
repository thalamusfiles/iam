import { Module } from '@nestjs/common';
import { AppIamModule } from './app/iam/appiam.module';
import { AppMgtModule } from './app/mgt/appmgt.module';
import ModelModule from './model/model.module';

@Module({
  imports: [ModelModule, AppIamModule, AppMgtModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
