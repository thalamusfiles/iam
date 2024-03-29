import { RequiredEntityData } from '@mikro-orm/core';
import { Expose } from 'class-transformer';
import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { IamBaseEntity } from '../../../model/Base/IamBaseEntity';
import { IdTokenInfo } from '../../auth/passaport/access-user-info';

export class FindProps<Type> {
  /**
   * Indica quais relações de entidade devem ser carregadas.
   */
  @IsOptional()
  @IsObject()
  where?: Partial<Type> | any;

  @Expose()
  @IsOptional()
  limit?: number;

  @Expose()
  @IsOptional()
  offset?: number;

  @Expose()
  order_by?: Array<string>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  populate?: Array<string>;
}

type EntityPropsOptions = any;

export class EntityProps<Type> {
  @IsObject()
  @IsOptional()
  options?: EntityPropsOptions;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  entity: RequiredEntityData<Type>;

  user?: Partial<IdTokenInfo>;
}

/***
 * Métodos obrigatórios a serem implementados nos controladores
 * que realizam as operações CRUD
 */
export interface CRUDController<Type extends IamBaseEntity> {
  /**
   * Buscar lista de registros
   */
  find(query?: FindProps<Type>, request?: any): Promise<Type[]>;
  /**
   * Buscar um único registro
   */
  findById(uuid: string, query?: FindProps<Type>, request?: any): Promise<Type>;
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
  //saveAll(props: EntityProps<Type>[], request: any): Promise<EntityProps<Type>[]>;
  /**
   * Remover um único registro
   * @param uuid
   * @param request Requisição NestJs
   */
  delete(uuid: string, props: EntityProps<Type>, request: any): Promise<void>;
}
