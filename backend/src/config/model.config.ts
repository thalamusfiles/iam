import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
// Carregar neste ordem para não gerar erro de dependência cíclica
import { User } from '../model/User';
import { UserLogin } from '../model/UserLogin';
import { Permission } from '../model/Permission';
import { Role } from '../model/Role';
import { Application } from '../model/System/Application';
import { UserToken } from '../model/UserToken';

const defaultModelConfig = {
  host: 'localhost',
  port: 5432,
  dbName: 'iam',
  user: 'iam_user',
  password: 'iam_password',
  charset: 'UTF8',
};

const modelConfig: MikroOrmModuleSyncOptions = {
  entities: [
    // System
    Application,
    // Base
    User,
    UserLogin,
    // Auth
    UserToken,
    // Mgt
    Role,
    Permission,
  ],
  entitiesTs: ['./src/model'],
  type: 'postgresql',
  host: process.env.DATABASE_HOST || defaultModelConfig.host,
  port: parseInt(process.env.DATABASE_PORT, 10) || defaultModelConfig.port,
  dbName: process.env.DATABASE_NAME || defaultModelConfig.dbName,
  user: process.env.DATABASE_USER || defaultModelConfig.user,
  password: process.env.DATABASE_PASS || defaultModelConfig.password,
  charset: process.env.DATABASE_CHARSET || defaultModelConfig.charset,
};

export default modelConfig;
