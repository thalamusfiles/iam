import env from '../.env';

import { IamApisConfigure } from '@thalamus/iam-consumer';

const apiConfigure = (accessToken: string | null, applicationLogged: string) => {
  const url = env.BASE_URL || window.location.origin.replace(/:[^\\/].*/, '');
  const port = env.BASE_PORT !== '80' ? env.BASE_PORT : '';

  IamApisConfigure.configureConsumer(url, port);
  if (accessToken) {
    IamApisConfigure.setGlobalAuthorizationToken(accessToken);
    IamApisConfigure.setGlobalApplication(applicationLogged);
  }
};

export default apiConfigure;
