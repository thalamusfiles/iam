import { MikroOrmModule } from '@mikro-orm/nestjs';
import modelConfig from 'src/config/model.config';

const ModelModule = MikroOrmModule.forRoot({
  entities: ['./dist/model'],
  entitiesTs: ['./src/model'],
  host: modelConfig.host,
  port: modelConfig.port,
  dbName: modelConfig.dbName,
  user: modelConfig.user,
  password: modelConfig.password,
  charset: modelConfig.charset,
  type: 'postgresql',
});

export default ModelModule;
