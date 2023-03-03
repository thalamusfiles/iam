//import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppIamModule } from './iam/appiam.module';
import { AppMgtModule } from './mgt/appmgt.module';
import ModelModule from './model.module';

@Module({
  imports: [
    //
    ModelModule,
    //MikroOrmModule.forMiddleware(),
    AuthModule,
    AppIamModule,
    AppMgtModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
