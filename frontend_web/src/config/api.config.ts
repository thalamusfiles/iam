import { IamApisConfigure } from '@thalamus/iam-consumer';

const apiConfig = {
  BASE_URL: 'localhost',
  BASE_PORT: '3000',
};

const apiConfigure = () => {
  IamApisConfigure.configureConsumer(apiConfig.BASE_URL, apiConfig.BASE_PORT);
};

export default apiConfigure;
