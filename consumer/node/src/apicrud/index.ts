import Endpoints from '../endpoints';
import { CRUDDatasource } from './api';

/**
 * User
 */
export class UserCRUDDatasource extends CRUDDatasource {
  constructor() {
    super(Endpoints.apiMGTUser);
  }
}

/**
 * Role
 */
export class RoleCRUDDatasource extends CRUDDatasource {
  constructor() {
    super(Endpoints.apiMGTRole);
  }
}

/**
 * Permission
 */
export class PermissionCRUDDatasource extends CRUDDatasource {
  constructor() {
    super(Endpoints.apiMGTPermission);
  }
}

/**
 * Application
 */
export class ApplicationCRUDDatasource extends CRUDDatasource {
  constructor() {
    super(Endpoints.apiMGTApplication);
  }
}
