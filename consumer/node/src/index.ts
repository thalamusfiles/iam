import { ApplicationCRUDDatasource, PermissionCRUDDatasource, UserCRUDDatasource, RoleCRUDDatasource } from './apicrud';
import Apis from './apis';
import { OauthDataSource, AuthDataSource, OauthFieldsDto, RegisterDto, LoginDto, ApplicationInfo, ScopeInfo } from './auth';
import { MeDataSource, TokenDataSource, UserInfo, TokenInfo } from './iam';

export {
  // Apis Auth
  OauthDataSource,
  AuthDataSource,
  // Apis Iam
  MeDataSource,
  TokenDataSource,
  // Apis Mgt
  UserCRUDDatasource,
  RoleCRUDDatasource,
  PermissionCRUDDatasource,
  ApplicationCRUDDatasource,
  // Configure
  Apis as IamApisConfigure,
  // Dtos
  LoginDto,
  OauthFieldsDto,
  UserInfo,
  TokenInfo,
  RegisterDto,
  ApplicationInfo,
  ScopeInfo,
};
