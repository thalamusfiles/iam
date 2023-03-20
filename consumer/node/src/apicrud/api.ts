import { ApiCRUD } from '../apis';
import { EntityProps } from './types/entity-props';

type EntityPropsOptions = {
  loadBeforSave?: true;
};

export interface CRUDInterface {
  findAll(options?: { relations?: [] } | any): Promise<any[]>;
  findById(id: number, options?: any): Promise<any>;
  create(entity: any, options?: EntityPropsOptions): Promise<EntityProps<any>>;
  update(id: number, entity: any, options?: EntityPropsOptions): Promise<EntityProps<any>>;
  updateAll(entities: any[], options?: EntityPropsOptions): Promise<EntityProps<any>[]>;
  remove(id: number): Promise<any>;
}
/**
 * API Generica que realiza as operações crud no servidor.
 */
export abstract class CRUDDatasource implements CRUDInterface {
  constructor(private endpoint: string) {}

  findAll(options?: { relations?: [] } | any) {
    //TODO: Criar método genérico de consulta de listagem
    return ApiCRUD.get<any[]>(this.endpoint, {
      params: {
        ...options,
      },
    }).then((axios) => axios.data);
  }

  findById(id: number, options?: { relations: [] }) {
    return ApiCRUD.get<any>(this.endpoint + '/' + id, {
      params: {
        relations: options?.relations,
      },
    }).then((axios) => axios.data);
  }

  create(entity: any, options?: EntityPropsOptions) {
    return ApiCRUD.post<EntityProps<any>>(this.endpoint, { entity, options }).then((axios) => axios.data);
  }

  update(id: number, entity: any, options?: EntityPropsOptions) {
    return ApiCRUD.put<EntityProps<any>>(this.endpoint + '/' + id, { entity, options }).then((axios) => axios.data);
  }

  updateAll(entities: any[], options?: EntityPropsOptions) {
    return ApiCRUD.put<EntityProps<any>[]>(this.endpoint, { entities, options }).then((axios) => axios.data);
  }

  remove(id: number) {
    return ApiCRUD.delete<void>(this.endpoint + '/' + id).then((axios) => axios.data);
  }
}
