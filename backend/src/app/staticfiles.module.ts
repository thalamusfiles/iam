import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import iamConfig from '../config/iam.config';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'frontend'),
      serveStaticOptions: {
        maxAge: iamConfig.STATIC_FILE_MAX_AGE,
      },
    }),
  ],
})
export class StaticFileModule {}
