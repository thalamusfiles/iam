import { EntityRepository, FindOptions, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { Permission } from '../../../model/Permission';
import { EntityProps, FindProps } from '../types/crud.controller';
import { CRUDService } from '../types/crud.service';

@Injectable()
export class PermissionService implements CRUDService<Permission> {
  private readonly logger = new Logger(PermissionService.name);

  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: EntityRepository<Permission>,
  ) {
    this.logger.log('starting');
  }

  /**
   * Busca por vários registros
   * @param query
   * @returns
   */
  async find(query?: FindProps<Permission>): Promise<Permission[]> {
    this.logger.verbose('Find all');

    const options: FindOptions<Permission> = {};
    if (query.populate) {
      Object.assign(options, { populate: query.populate });
    }

    return this.permissionRepository.find(query?.where, options);
  }

  /**
   * Busca o registro pelo seu identificador
   * @param id
   * @param _query
   * @returns
   */
  async findById(id: string, query?: FindProps<Permission>): Promise<Permission> {
    this.logger.verbose('Find by Id');

    const options: FindOptions<Permission> = {};
    if (query.populate) {
      Object.assign(options, { populate: query.populate });
    }

    return this.permissionRepository.findOne(id, options);
  }

  /**
   * Cria ou atualiza o registro
   * @param element
   * @returns
   */
  async save(element: EntityProps<Permission>): Promise<Permission> {
    this.logger.verbose('Save');

    const uuid = element.entity.uuid;
    if (uuid) {
      const ref = this.permissionRepository.getReference(uuid);
      element.entity = wrap(ref).assign(element.entity);
    } else {
      element.entity = this.permissionRepository.create(element.entity);
    }
    await this.permissionRepository.flush();

    return element.entity as Permission;
  }

  /**
   * Remove o Registro
   * @param uuid
   * @param _element
   * @returns
   */
  async delete(uuid: string, _element: EntityProps<Permission>): Promise<void> {
    this.logger.verbose('Delete');

    const entity = this.permissionRepository.getReference(uuid);
    return this.permissionRepository.removeAndFlush(entity);
  }
}
