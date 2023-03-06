import { Request } from 'supertest';
import iamConfig from '../../src/config/iam.config';

// Header obrigatório para incluir região ou applicação
export const addGlobalIAMMgtRequestHeader = <T extends Request>(req: T): T => {
  req //
    .set('region', iamConfig.MAIN_REGION)
    .set('application', iamConfig.MAIN_APP_IAM_MGT)
    .set('User-Agent', 'E2E/Unit test');
  return req;
};

// Header obrigatório para incluir região ou applicação
export const addRegionAppRequestHeader = <T extends Request>(req: T): T => {
  req //
    .set('region', iamConfig.MAIN_REGION)
    .set('application', iamConfig.MAIN_APP_IAM)
    .set('User-Agent', 'E2E/Unit test');
  return req;
};

export const addBearerAuthorization = <T extends Request>(req: T, accessToken: string): T => {
  req.set('Authorization', `Bearer ${accessToken}`);
  return req;
};
