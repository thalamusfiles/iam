import { ApplicationCRUDDatasource, PermissionCRUDDatasource, PersonCRUDDatasource, RegionCRUDDatasource, RoleCRUDDatasource } from './apicrud';
import { initApis, setAuthorizationToken } from './apis';
import { AuthDataSource } from './auth';
import { configureEndpoint } from './endpoints';

const configureConsumer = (baseUrl?: string, basePort?: string): void => {
  configureEndpoint(baseUrl, basePort);
  initApis();
};

export {
  //
  AuthDataSource,
  PersonCRUDDatasource,
  RoleCRUDDatasource,
  PermissionCRUDDatasource,
  RegionCRUDDatasource,
  ApplicationCRUDDatasource,
  configureConsumer,
  setAuthorizationToken,
};
