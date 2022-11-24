import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { localStorageDef } from '../commons/consts';
import Storage from '../commons/storage';
import { EndpointsDef } from './endpoints';

/**
 * Default Headers
 */
axios.defaults.headers = {
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Origin': '*',
};

/**
 * Intercepta todas as requisições
 * @param config
 */
const requestInterceptors = (config: any) => {
  const token = Storage.getItem(localStorageDef.tokenKey);
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
};

const axiosStart = (config: AxiosRequestConfig): AxiosInstance => {
  const api = axios.create(config);
  api.interceptors.request.use(requestInterceptors);
  return api;
};

const ApiCRUD = axiosStart({
  baseURL: EndpointsDef.apiCRUD,
  timeout: EndpointsDef.timeout,
});

const ApiGraphQL = axiosStart({
  baseURL: EndpointsDef.apiGraphQL,
  timeout: EndpointsDef.timeout,
});

const ApiAuth = axiosStart({
  baseURL: EndpointsDef.apiAuth,
  timeout: EndpointsDef.timeout,
});

export { ApiCRUD, ApiGraphQL, ApiAuth };
