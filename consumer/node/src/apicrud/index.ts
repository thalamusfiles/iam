import Endpoints from '../endpoints';
import { CRUDDatasource } from './api';

/**
 * Person
 */
export class PersonCRUDDatasource extends CRUDDatasource {
  constructor() {
    super(Endpoints.apiMGTPerson);
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


/**
 * Region
 */
export class RegionCRUDDatasource extends CRUDDatasource {
  constructor() {
    super(Endpoints.apiMGTRegion);
  }
}
