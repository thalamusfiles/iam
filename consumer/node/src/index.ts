import { ApplicationCRUDDatasource, PermissionCRUDDatasource, PersonCRUDDatasource, RegionCRUDDatasource, RoleCRUDDatasource } from './apicrud';
import Apis from './apis';
import { AuthDataSource, OauthFieldsDto, RegisterDto, LoginDto } from './auth';

export {
  // Apis
  AuthDataSource,
  PersonCRUDDatasource,
  RoleCRUDDatasource,
  PermissionCRUDDatasource,
  RegionCRUDDatasource,
  ApplicationCRUDDatasource,
  // Configure
  Apis as IamApisConfigure,
  // Dtos
  OauthFieldsDto,
  RegisterDto,
  LoginDto,
};
