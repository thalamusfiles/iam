import Apis from '../apis';
import { EntityProps } from './types/entity-props';

type EntityPropsOptions = {
  loadBeforSave?: true;
};

export interface CRUDInterface {
  findAll(params?: { populate?: [] } | any): Promise<any[]>;
  findById(id: number, options?: { populate: [] }): Promise<any>;
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

  findAll(params?: { populate?: [] } | any) {
    //TODO: Criar método genérico de consulta de listagem
    return Apis.ApiMGT.get<any[]>(this.endpoint, {
      params: {
        ...params,
      },
    }).then((axios) => axios.data);
  }

  findById(id: number, options?: { populate: [] }) {
    return Apis.ApiMGT.get<any>(this.endpoint + '/' + id, {
      params: {
        populate: options?.populate,
      },
    }).then((axios) => axios.data);
  }

  create(entity: any, options?: EntityPropsOptions) {
    return Apis.ApiMGT.post<EntityProps<any>>(this.endpoint, { entity, options }).then((axios) => axios.data);
  }

  update(id: number, entity: any, options?: EntityPropsOptions) {
    return Apis.ApiMGT.put<EntityProps<any>>(this.endpoint + '/' + id, { entity, options }).then((axios) => axios.data);
  }

  updateAll(entities: any[], options?: EntityPropsOptions) {
    return Apis.ApiMGT.put<EntityProps<any>[]>(this.endpoint, { entities, options }).then((axios) => axios.data);
  }

  remove(id: number) {
    return Apis.ApiMGT.delete<void>(this.endpoint + '/' + id).then((axios) => axios.data);
  }
}
