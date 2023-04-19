import env from '../.env';

import { IamApisConfigure } from '@thalamus/iam-consumer';

const apiConfigure = (accessToken: string | null, applicationLogged: string) => {
  IamApisConfigure.configureConsumer(env.BASE_URL || window.location.origin.replace(/:[^\\/].*/, ''), env.BASE_PORT);
  if (accessToken) {
    IamApisConfigure.setGlobalAuthorizationToken(accessToken);
    IamApisConfigure.setGlobalApplication(applicationLogged);
  }
};

export default apiConfigure;
