import { Module } from '@nestjs/common';
import { AppIamModule } from './iam/appiam.module';
import { AppMgtModule } from './mgt/appmgt.module';
import ModelModule from './model.module';

@Module({
  imports: [ModelModule, AppIamModule, AppMgtModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
