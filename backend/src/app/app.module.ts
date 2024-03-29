import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppIamModule } from './iam/appiam.module';
import { AppMgtModule } from './mgt/appmgt.module';
import ModelModule from './model.module';
import { StaticFileModule } from './staticfiles.module';

@Module({
  imports: [
    //
    ModelModule,
    AuthModule,
    AppIamModule,
    AppMgtModule,
    StaticFileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
