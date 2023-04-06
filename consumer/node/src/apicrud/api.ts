import Apis from '../apis';
import { EntityProps } from './types/entity-props';

type EntityPropsOptions = {
  loadBeforSave?: true;
};

export interface CRUDInterface {
  findAll(params?: { populate?: string[] } | any): Promise<any[]>;
  findById(uuid: string, options?: { populate: string[] }): Promise<any>;
  create(entity: any, options?: EntityPropsOptions): Promise<EntityProps<any>>;
  update(uuid: string, entity: any, options?: EntityPropsOptions): Promise<EntityProps<any>>;
  updateAll(entities: any[], options?: EntityPropsOptions): Promise<EntityProps<any>[]>;
  remove(uuid: string): Promise<any>;
}
/**
 * API Generica que realiza as operações crud no servidor.
 */
export abstract class CRUDDatasource implements CRUDInterface {
  constructor(private endpoint: string) {}

  findAll(params?: { populate?: string[] } | any) {
    //TODO: Criar método genérico de consulta de listagem
    return Apis.ApiMGT.get<any[]>(this.endpoint, {
      params: {
        ...params,
      },
    }).then((axios) => axios.data);
  }

  findById(uuid: string, options?: { populate: string[] }) {
    return Apis.ApiMGT.get<any>(this.endpoint + '/' + uuid, {
      params: {
        populate: options?.populate,
      },
    }).then((axios) => axios.data);
  }

  create(entity: any, options?: EntityPropsOptions) {
    return Apis.ApiMGT.post<EntityProps<any>>(this.endpoint, { entity, options }).then((axios) => axios.data);
  }

  update(uuid: string, entity: any, options?: EntityPropsOptions) {
    return Apis.ApiMGT.put<EntityProps<any>>(this.endpoint + '/' + uuid, { entity, options }).then((axios) => axios.data);
  }

  updateAll(entities: any[], options?: EntityPropsOptions) {
    return Apis.ApiMGT.put<EntityProps<any>[]>(this.endpoint, { entities, options }).then((axios) => axios.data);
  }

  remove(uuid: string) {
    return Apis.ApiMGT.delete<void>(this.endpoint + '/' + uuid).then((axios) => axios.data);
  }
}
