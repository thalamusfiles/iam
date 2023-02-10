import { MikroOrmModule } from '@mikro-orm/nestjs';
import modelConfig from '../config/model.config';

const ModelModule = MikroOrmModule.forRoot({
  ...modelConfig,
});

export default ModelModule;
