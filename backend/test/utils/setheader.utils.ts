import { Request } from 'supertest';
import iamConfig from '../../src/config/iam.config';

// Header obrigatório para incluir região ou applicação
export const addGlobalIAMMgtRequestHeader = <T extends Request>(req: T): T => {
  req.set('region', iamConfig.BASE_REGION).set('application', iamConfig.BASE_APP_IAM_MGT);
  return req;
};
