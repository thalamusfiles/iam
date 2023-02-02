import { IamBaseEntity } from 'src/model/Base/IamBaseEntity';
import { EntityProps, FindProps } from './crud.controller';

/***
 * Métodos obrigatórios a serem implementados nos repositórios
 * que realizam as operações CRUD
 * para que o CRUDControler funcione
 */
export interface CRUDService<Type extends IamBaseEntity> {
  /**
   * Busca lista de entidades
   * @param query
   */
  find(query?: FindProps<Type>): Promise<Type[]>;
  /**
   * Busca registro da entidade
   * @param id
   */
  findById(id: string, query?: FindProps<Type>): Promise<Type>;
  /**
   * Cria ou atualiza entidade
   * @param element
   */
  save(element: EntityProps<Type>): Promise<Type>;
  /**
   * Cria ou atualizar lista de entidades
   * @param elements
   */
  delete(id: string, element: EntityProps<Type>): Promise<void>;
}
