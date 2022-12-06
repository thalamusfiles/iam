import { EndpointsDef } from '../endpoints';
import { CRUDDatasource } from './api';

/**
 * Person
 */
export class PersonCRUDDatasource extends CRUDDatasource {
  constructor() {
    super(EndpointsDef.apiCRUDPerson);
  }
}

/**
 * Role
 */
export class RoleCRUDDatasource extends CRUDDatasource {
  constructor() {
    super(EndpointsDef.apiCRUDRole);
  }
}

/**
 * Permission
 */
export class PermissionCRUDDatasource extends CRUDDatasource {
  constructor() {
    super(EndpointsDef.apiCRUDPermission);
  }
}

/**
 * Region
 */
export class RegionCRUDDatasource extends CRUDDatasource {
  constructor() {
    super(EndpointsDef.apiCRUDRegion);
  }
}

/**
 * Application
 */
export class ApplicationCRUDDatasource extends CRUDDatasource {
  constructor() {
    super(EndpointsDef.apiCRUDApplication);
  }
}
