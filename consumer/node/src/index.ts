import { ApplicationCRUDDatasource, PermissionCRUDDatasource, PersonCRUDDatasource, RegionCRUDDatasource, RoleCRUDDatasource } from './apicrud';
import Apis from './apis';
import { AuthDataSource } from './auth';

export {
  AuthDataSource,
  PersonCRUDDatasource,
  RoleCRUDDatasource,
  PermissionCRUDDatasource,
  RegionCRUDDatasource,
  ApplicationCRUDDatasource,
  Apis as IamApisConfigure,
};
