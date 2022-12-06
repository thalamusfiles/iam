import { EndpointsDef } from '../endpoints';
import { GraphQLDatasource } from './api';

/**
 * Person
 */
export class PersonGraphQLDatasource extends GraphQLDatasource {
  constructor() {
    super(EndpointsDef.apiGraphQLPerson);
  }
}

/**
 * Role
 */
export class RoleGraphQLDatasource extends GraphQLDatasource {
  constructor() {
    super(EndpointsDef.apiGraphQLRole);
  }
}

/**
 * Permission
 */
export class PermissionGraphQLDatasource extends GraphQLDatasource {
  constructor() {
    super(EndpointsDef.apiGraphQLPermission);
  }
}

/**
 * Region
 */
export class RegionGraphQLDatasource extends GraphQLDatasource {
  constructor() {
    super(EndpointsDef.apiGraphQLRegion);
  }
}

/**
 * Application
 */
export class ApplicationGraphQLDatasource extends GraphQLDatasource {
  constructor() {
    super(EndpointsDef.apiGraphQLApplication);
  }
}
