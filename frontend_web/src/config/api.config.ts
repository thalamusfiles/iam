import { IamApisConfigure } from '@thalamus/iam-consumer';
import env from '../.env';
import { getLinkTo } from '../commons/route';
import UserCtxInstance from '../store/userContext';

const apiConfigure = (accessToken: string | null, applicationLogged: string) => {
  const url = env.BASE_URL || window.location.origin.replace(/:[^\\/].*/, '');
  const port = env.BASE_PORT !== '80' ? env.BASE_PORT : '';

  IamApisConfigure.configureConsumer(url, port);

  if (accessToken) {
    IamApisConfigure.setGlobalAuthorizationToken(accessToken);
    IamApisConfigure.setGlobalApplication(applicationLogged);

    IamApisConfigure.axiosInstances().forEach((api) => {
      api.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response.status === 401) {
            UserCtxInstance.logout();

            window.location.href = getLinkTo('mgt');
          }

          return Promise.reject(error);
        },
      );
    });
  }
};

export default apiConfigure;
