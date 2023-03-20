import { EndpointsDef } from '../endpoints';
import { CRUDDatasource } from './api';

/**
 * Person
 */
export class PersonCRUDDatasource extends CRUDDatasource {
  constructor() {
    super(EndpointsDef.apiMGTPerson);
  }
}

/**
 * Role
 */
export class RoleCRUDDatasource extends CRUDDatasource {
  constructor() {
    super(EndpointsDef.apiMGTRole);
  }
}

/**
 * Permission
 */
export class PermissionCRUDDatasource extends CRUDDatasource {
  constructor() {
    super(EndpointsDef.apiMGTPermission);
  }
}

/**
 * Application
 */
export class ApplicationCRUDDatasource extends CRUDDatasource {
  constructor() {
    super(EndpointsDef.apiMGTApplication);
  }
}
