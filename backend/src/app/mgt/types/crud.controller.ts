import { IsNotEmpty, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { IamBaseEntity } from '../../../model/Base/IamBaseEntity';

export type FindProps<Type> = {
  //FindManyOptions<Type>;
  /**
   * Indica quais relações de entidade devem ser carregadas.
   */
  where?: Partial<Type> | any;
  populate?: string[];
};

type EntityPropsOptions = {
  loadBeforSave?: true;
};

export class EntityProps<Type> {
  @IsObject()
  @IsOptional()
  options?: EntityPropsOptions;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  entity: Partial<Type>;

  user?: any;
}

/***
 * Métodos obrigatórios a serem implementados nos controladores
 * que realizam as operações CRUD
 */
export interface CRUDController<Type extends IamBaseEntity> {
  /**
   * Buscar lista de registros
   */
  find(query?: FindProps<Type>): Promise<Type[]>;
  /**
   * Buscar um único registro
   */
  findById(uuid: string, query?: FindProps<Type>): Promise<Type>;
  /**
   * Criar registro
   * e retorno registro atualizado
   * @param entity Entidade da Coleção de dados
   * @param request Requisição NestJs
   */
  create(props: EntityProps<Type>, request: any): Promise<EntityProps<Type>>;
  /**
   * Atualizar um único registro
   * e retorno registro atualizado
   * @param uuid
   * @param entity
   * @param request Requisição NestJs
   */
  update(uuid: string, props: EntityProps<Type>, request: any): Promise<EntityProps<Type>>;
  /**
   * Criar e Atualizar lista de registros
   * @param entities
   * @param request Requisição NestJs
   */
  saveAll(props: EntityProps<Type>[], request: any): Promise<EntityProps<Type>[]>;
  /**
   * Remover um único registro
   * @param uuid
   * @param request Requisição NestJs
   */
  delete(uuid: string, request: any): Promise<void>;
}
