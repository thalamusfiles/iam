import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

const baseUrl = process.env.BASE_URL || 'localhost';
const basePort = process.env.BASE_PORT || '3000';

const baseEndpoint = `${baseUrl}:${basePort}`; //Todo: coletar via variável de ambiente. Env
const apiAuth = `${baseEndpoint}/auth`;
const apiMGT = `${baseEndpoint}/apicrud`;

export const EndpointsDef = {
  url: basePort,
  port: basePort,
  base: baseEndpoint,
  timeout: 5000,
  //Modules Urls
  managementUrl: '/mgt',
  //AUTH Urls
  apiAuth: apiAuth,
  apiAuthLogin: '/login',
  //API MGT Urls
  apiMGT: apiMGT,
  apiMGTPerson: `/person`,
  apiMGTRole: `/role`,
  apiMGTPermission: `/permission`,
  apiMGTApplication: `/application`,
};
