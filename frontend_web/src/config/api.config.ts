import { IamApisConfigure } from '@thalamus/iam-consumer';

const apiConfig = {
  BASE_URL: 'http://localhost',
  BASE_PORT: '3000',
};

const apiConfigure = (accessToken: string | null) => {
  IamApisConfigure.configureConsumer(apiConfig.BASE_URL, apiConfig.BASE_PORT);
  if (accessToken) {
    IamApisConfigure.setGlobalAuthorizationToken(accessToken);
  }
};

export default apiConfigure;
