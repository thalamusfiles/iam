import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import Endpoint from './endpoints';

class IamApisConfigure {
  token = '';
  application = '';
  ApiAuth: AxiosInstance;
  ApiIAM: AxiosInstance;
  ApiMGT: AxiosInstance;

  /**
   * Intercepta todas as requisições
   * @param config
   */
  requestInterceptors = (config: any) => {
    if (this.token) config.headers.Authorization = 'Bearer ' + this.token;
    if (this.application) config.headers.application = this.application;
    return config;
  };

  axiosStart = (config: AxiosRequestConfig): AxiosInstance => {
    // Default Headers
    //axios.defaults.headers.common['Access-Control-Allow-Credentials'] = true;
    //axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

    const api = axios.create(config);
    api.interceptors.request.use(this.requestInterceptors);
    return api;
  };

  axiosInstances = (): Array<AxiosInstance> => {
    return [this.ApiAuth, this.ApiIAM, this.ApiMGT];
  };

  initApis = () => {
    this.ApiAuth = this.axiosStart({
      baseURL: Endpoint.apiAuth!,
      timeout: Endpoint.timeout,
      withCredentials: true,
    });

    this.ApiIAM = this.axiosStart({
      baseURL: Endpoint.apiIAM!,
      timeout: Endpoint.timeout,
    });

    this.ApiMGT = this.axiosStart({
      baseURL: Endpoint.apiMGT!,
      timeout: Endpoint.timeout,
    });
  };

  setGlobalAuthorizationToken = (newToken: string): void => {
    this.token = newToken;
  };

  setGlobalApplication = (application: string): void => {
    this.application = application;
  };

  configureConsumer = (baseUrl?: string, basePort?: string): void => {
    Endpoint.configureEndpoint(baseUrl, basePort);
    this.initApis();
  };
}

const Apis = new IamApisConfigure();
export default Apis;
