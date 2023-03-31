import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import Endpoint from './endpoints';

class IamApisConfigure {
  token = '';
  ApiMGT: AxiosInstance;
  ApiIAM: AxiosInstance;
  ApiAuth: AxiosInstance;

  /**
   * Intercepta todas as requisições
   * @param config
   */
  requestInterceptors = (config: any) => {
    if (this.token) config.headers.Authorization = 'Bearer ' + this.token;
    return config;
  };

  axiosStart = (config: AxiosRequestConfig): AxiosInstance => {
    // Default Headers
    axios.defaults.headers.common['Access-Control-Allow-Credentials'] = true;
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

    const api = axios.create(config);
    api.interceptors.request.use(this.requestInterceptors);
    return api;
  };

  initApis = () => {
    this.ApiMGT = this.axiosStart({
      baseURL: Endpoint.apiMGT!,
      timeout: Endpoint.timeout,
    });

    this.ApiAuth = this.axiosStart({
      baseURL: Endpoint.apiAuth!,
      timeout: Endpoint.timeout,
    });

    this.ApiIAM = this.axiosStart({
      baseURL: Endpoint.apiIAM!,
      timeout: Endpoint.timeout,
    });
  };

  setGlobalAuthorizationToken = (newToken: string): void => {
    this.token = newToken;
  };

  configureConsumer = (baseUrl?: string, basePort?: string): void => {
    Endpoint.configureEndpoint(baseUrl, basePort);
    this.initApis();
  };
}

const Apis = new IamApisConfigure();
export default Apis;
