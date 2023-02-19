import { Request } from 'supertest';
import iamConfig from '../../src/config/iam.config';

// Header obrigatório para incluir região ou applicação
export const addGlobalIAMMgtRequestHeader = <T extends Request>(req: T): T => {
  req.set('region', iamConfig.MAIN_REGION).set('application', iamConfig.MAIN_APP_IAM_MGT);
  return req;
};
