import { LoadStrategy } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import modelConfig from '../config/model.config';

const ModelModule = MikroOrmModule.forRoot({
  ...modelConfig,
  loadStrategy: LoadStrategy.JOINED,
});

export default ModelModule;
