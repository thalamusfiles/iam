import { IamApisConfigure } from '@thalamus/iam-consumer';

const apiConfig = {
  BASE_URL: 'http://localhost',
  BASE_PORT: '3000',
};

const apiConfigure = (accessToken: string | null, applicationLogged: string) => {
  IamApisConfigure.configureConsumer(apiConfig.BASE_URL, apiConfig.BASE_PORT);
  if (accessToken) {
    IamApisConfigure.setGlobalAuthorizationToken(accessToken);
    IamApisConfigure.setGlobalApplication(applicationLogged);
  }
};

export default apiConfigure;
