import { ApplicationCRUDDatasource, PermissionCRUDDatasource, PersonCRUDDatasource, RegionCRUDDatasource, RoleCRUDDatasource } from './apicrud';
import { configureConsumer, setAuthorizationToken } from './apis';
import { AuthDataSource } from './auth';

export {
  AuthDataSource,
  PersonCRUDDatasource,
  RoleCRUDDatasource,
  PermissionCRUDDatasource,
  RegionCRUDDatasource,
  ApplicationCRUDDatasource,
  configureConsumer,
  setAuthorizationToken,
};
