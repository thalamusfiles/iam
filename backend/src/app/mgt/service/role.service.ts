import { EntityRepository, FindOptions, QueryOrder, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { Permission } from '../../../model/Permission';
import { Role } from '../../../model/Role';
import { EntityProps, FindProps } from '../types/crud.controller';
import { CRUDService } from '../types/crud.service';

@Injectable()
export class RoleService implements CRUDService<Role> {
  private readonly logger = new Logger(RoleService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: EntityRepository<Role>,
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
  async find(query?: FindProps<Role>): Promise<Role[]> {
    this.logger.verbose('Find all');

    const options: FindOptions<Role> = {
      orderBy: {},
      limit: query.limit,
      offset: query.offset,
    };

    // Ilike name
    if (query?.where?.name) {
      query.where.name = { $ilike: `%${query.where.name}%` };
    }

    // Adiciona joins/campos adicionais
    if (query.populate) {
      Object.assign(options, { populate: query.populate });
    }

    // Formata os filtros
    query.order_by?.forEach((orderBy) => {
      const [by, order] = orderBy.split(':');
      options.orderBy[by] = order.toUpperCase() === QueryOrder.ASC ? QueryOrder.ASC : QueryOrder.DESC;
    });

    return this.roleRepository.find(query?.where, options);
  }

  /**
   * Busca o registro pelo seu identificador
   * @param id
   * @param _query
   * @returns
   */
  async findById(id: string, query?: FindProps<Role>): Promise<Role> {
    this.logger.verbose('Find by Id');

    const options: FindOptions<Role> = {};
    if (query.populate) {
      Object.assign(options, { populate: query.populate });
    }

    return this.roleRepository.findOne(id, options);
  }

  /**
   * Cria ou atualiza o registro
   * @param element
   * @returns
   */
  async save(element: EntityProps<Role>): Promise<Role> {
    this.logger.verbose('Save');

    const uuid = element.entity.uuid;

    if (element.entity.permissions) {
      element.entity.permissions = (element.entity.permissions as any).map((perm) => this.permissionRepository.getReference(perm.uuid));
    }

    if (uuid) {
      const ref = await this.roleRepository.findOneOrFail({ uuid });
      element.entity = wrap(ref).assign(element.entity);
    } else {
      element.entity = this.roleRepository.create(element.entity);
    }
    await this.roleRepository.flush();

    return element.entity as Role;
  }

  /**
   * Remove o Registro
   * @param uuid
   * @param _element
   * @returns
   */
  async delete(uuid: string, _element: EntityProps<Role>): Promise<void> {
    this.logger.verbose('Delete');

    const entity = this.roleRepository.getReference(uuid);
    return this.roleRepository.removeAndFlush(entity);
  }
}
