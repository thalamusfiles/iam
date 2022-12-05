import env from '../.env';

const baseEndpoint = `${env.baseUrl}:${env.basePort}`; //Todo: coletar via variável de ambiente. Env
const apiCRUD = `${baseEndpoint}/apicrud`;
const apiGraphQL = `${baseEndpoint}/apigraphql`;
const apiAuth = `${baseEndpoint}/auth`;

export const EndpointsDef = {
  url: env.baseUrl,
  port: env.basePort,
  base: baseEndpoint,
  auth: `${baseEndpoint}/auth`,
  timeout: 5000,
  //Modules Urls
  managementUrl: '/mgt',
  biUrl: '/bi',
  configUrl: '/config',
  //AUTH Urls
  apiAuth: apiAuth,
  apiAuthLogin: '/login',
  //API CRUD Urls
  apiCRUD: apiCRUD,
  apiCRUDPerson: `/person`,
  apiCRUDRole: `/role`,
  apiCRUDPermission: `/permission`,
  apiCRUDRegion: `/region`,
  apiCRUDApplication: `/application`,
  //API GraphQL UrlS
  apiGraphQL: apiGraphQL,
  apiGraphQLPerson: `person`,
  apiGraphQLRole: `role`,
  apiGraphQLPermission: `permission`,
  apiGraphQLRegion: `region`,
  apiGraphQLApplication: `application`,
};
