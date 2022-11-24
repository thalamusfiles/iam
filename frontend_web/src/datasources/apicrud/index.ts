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
