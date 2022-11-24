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
