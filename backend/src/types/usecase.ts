import { EntityProps } from '../app/mgt/types/crud.controller';
import { RequestInfo } from '../app/mgt/types/request-info';
import { FormExceptionError } from './form.exception';

export type UseCasePluginMetadata<T = any> = {
  //Nome da relação do banco
  name: any;
  //Transaction utilizada para salvar o registro
  //transaction?: Transaction;
} & EntityProps<T>;

export enum UseCaseMethod {
  preValidate,
  prePersist,
  postPersist,
  preUpdate,
  postUpdate,
  preSave,
  postSave,
  preRemove,
  postRemove,
}

/**
 * Definição de funcionalidades dos casos de uso
 * Os casos de são vinculados aos controladores da apicrud
 */
interface UseCasePluginI {
  //Chamado no inicio, processado antes de qualquer ação de persistência
  preValidate(data: UseCasePluginMetadata, request: RequestInfo): Promise<Array<FormExceptionError>>;

  //Chamado antes de cadastrar o registro
  prePersist(data: UseCasePluginMetadata, request: RequestInfo): Promise<void>;
  //Chamado após cadastrar o registro
  postPersist(data: UseCasePluginMetadata, request: RequestInfo): Promise<void>;

  //Chamado antes de atualizar o registro
  preUpdate(data: UseCasePluginMetadata, request: RequestInfo): Promise<void>;
  //Chamado após atualizar o registro
  postUpdate(data: UseCasePluginMetadata, request: RequestInfo): Promise<void>;

  //Chamado antes de cadastrar ou atualizar o registro
  preSave(data: UseCasePluginMetadata, request: RequestInfo): Promise<void>;
  //Chamado após cadastrar ou atualizar o registro
  postSave(data: UseCasePluginMetadata, request: RequestInfo): Promise<void>;

  //Chamado antes de remover o registro
  preRemove(data: UseCasePluginMetadata, request: RequestInfo): Promise<void>;
  //Chamado após remover o registro
  postRemove(data: UseCasePluginMetadata, request: RequestInfo): Promise<void>;
}

/**
 * Implementação parcial (abstrata) da interface de caso de usos.
 */
export abstract class UseCasePlugin<T = any> implements UseCasePluginI {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  preValidate = async (data: UseCasePluginMetadata<T>, request: RequestInfo): Promise<Array<FormExceptionError>> => null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  prePersist = async (data: UseCasePluginMetadata<T>, request: RequestInfo): Promise<void> => null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  postPersist = async (data: UseCasePluginMetadata<T>, request: RequestInfo): Promise<void> => null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  preUpdate = async (data: UseCasePluginMetadata<T>, request: RequestInfo): Promise<void> => null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  postUpdate = async (data: UseCasePluginMetadata<T>, request: RequestInfo): Promise<void> => null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  preSave = async (data: UseCasePluginMetadata<T>, request: RequestInfo): Promise<void> => null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  postSave = async (data: UseCasePluginMetadata<T>, request: RequestInfo): Promise<void> => null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  preRemove = async (data: UseCasePluginMetadata<T>, request: RequestInfo): Promise<void> => null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  postRemove = async (data: UseCasePluginMetadata<T>, request: RequestInfo): Promise<void> => null;
}
