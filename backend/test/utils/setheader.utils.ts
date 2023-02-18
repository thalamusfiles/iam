import { Request } from 'supertest';

// Header obrigatório para incluir região ou applicação
const region = 'global';
const application = 'iam';

export const setGlobalRequestHeader = <T extends Request>(req: T): T => {
  req.set('region', region).set('application', application);
  return req;
};
