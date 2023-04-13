import { EntityRepository, FindOptions, QueryOrder, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Permission } from '../../../model/Permission';
import { Role } from '../../../model/Role';
import { EntityProps, FindProps } from '../types/crud.controller';
import { CRUDService } from '../types/crud.service';

@Injectable()
export class PermissionService implements CRUDService<Permission> {
  private readonly logger = new Logger(PermissionService.name);

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
  async find(query?: FindProps<Permission>): Promise<Permission[]> {
    this.logger.verbose('Find all');

    const options: FindOptions<Permission> = {
      orderBy: {},
      limit: query.limit,
      offset: query.offset,
    };

    // Ilike Initials
    if (query?.where?.initials) {
      query.where.initials = { $ilike: `%${query.where.initials}%` };
    }

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

    const where: Partial<Permission> = {
      uuid: id,
      ...query.where,
    };

    const options: FindOptions<Permission> = {};

    // Adiciona joins/campos adicionais
    if (query.populate) {
      Object.assign(options, { populate: query.populate });
    }

    return this.permissionRepository.findOneOrFail(where, options);
  }

  /**
   * Cria ou atualiza o registro
   * @param element
   * @returns
   */
  async save(element: EntityProps<Permission>): Promise<Permission> {
    this.logger.verbose('Save');

    if (element.entity.roles) {
      element.entity.roles = (element.entity.roles as any).map((perm) => this.permissionRepository.getReference(perm.uuid));
    }

    const uuid = element.entity.uuid;
    if (uuid) {
      const ref = await this.permissionRepository.findOneOrFail({ uuid });
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

    const entity = await this.permissionRepository.findOneOrFail(uuid);
    if (!entity) {
      this.logger.error('Tentativa de remoção de aplicação inexistente');
      throw new UnauthorizedException('This application does not exists');
    }

    await this.permissionRepository.nativeUpdate({ uuid }, { deletedAt: new Date() });
  }
}
