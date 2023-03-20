import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { EndpointsDef } from './endpoints';

/**
 * Default Headers
 */
axios.defaults.headers.common['Access-Control-Allow-Credentials'] = true;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

/**
 * Intercepta todas as requisições
 * @param config
 */
/*const requestInterceptors = (config: any) => {
  const token = Storage.getItem(localStorageDef.tokenKey);
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
};*/

const axiosStart = (config: AxiosRequestConfig): AxiosInstance => {
  const api = axios.create(config);
  //api.interceptors.request.use(requestInterceptors);
  return api;
};

const ApiMGT = axiosStart({
  baseURL: EndpointsDef.apiMGT,
  timeout: EndpointsDef.timeout,
});

const ApiAuth = axiosStart({
  baseURL: EndpointsDef.apiAuth,
  timeout: EndpointsDef.timeout,
});

export { ApiMGT, ApiAuth };
