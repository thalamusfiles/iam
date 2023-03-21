import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { configureEndpoint, EndpointsDef } from './endpoints';

/**
 * Default Headers
 */
axios.defaults.headers.common['Access-Control-Allow-Credentials'] = true;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

/**
 * Intercepta todas as requisições
 * @param config
 */
let token = '';
const requestInterceptors = (config: any) => {
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
};

const axiosStart = (config: AxiosRequestConfig): AxiosInstance => {
  const api = axios.create(config);
  api.interceptors.request.use(requestInterceptors);
  return api;
};

let ApiMGT: AxiosInstance;
let ApiAuth: AxiosInstance;

const initApis = () => {
  ApiMGT = axiosStart({
    baseURL: EndpointsDef.apiMGT!,
    timeout: EndpointsDef.timeout,
  });

  ApiAuth = axiosStart({
    baseURL: EndpointsDef.apiAuth!,
    timeout: EndpointsDef.timeout,
  });
};

const setAuthorizationToken = (newToken: string): void => {
  token = newToken;
};

const configureConsumer = (baseUrl?: string, basePort?: string): void => {
  configureEndpoint(baseUrl, basePort);
  initApis();
};


export { ApiMGT, ApiAuth, configureConsumer, setAuthorizationToken };
