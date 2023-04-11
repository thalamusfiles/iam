import { EntityRepository, FindOptions, QueryOrder, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Application } from '../../../model/System/Application';
import { User } from '../../../model/User';
import { EntityProps, FindProps } from '../types/crud.controller';
import { CRUDService } from '../types/crud.service';

@Injectable()
export class ApplicationService implements CRUDService<Application> {
  private readonly logger = new Logger(ApplicationService.name);

  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: EntityRepository<Application>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {
    this.logger.log('starting');
  }

  /**
   * Busca por vários registros
   * @param query
   * @returns
   */
  async find(query?: FindProps<Application>): Promise<Application[]> {
    this.logger.verbose('Find all');

    const options: FindOptions<Application> = {
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

    return this.applicationRepository.find(query?.where, options);
  }

  /**
   * Busca o registro pelo seu identificador
   * @param id
   * @param _query
   * @returns
   */
  async findById(id: string, query?: FindProps<Application>): Promise<Application> {
    this.logger.verbose('Find by Id');

    const options: FindOptions<Application> = {};

    // Adiciona joins/campos adicionais
    if (query.populate) {
      Object.assign(options, { populate: query.populate });
    }

    return this.applicationRepository.findOne(id, options);
  }

  /**
   * Cria ou atualiza o registro
   * @param element
   * @returns
   */
  async save(element: EntityProps<Application>): Promise<Application> {
    this.logger.verbose('Save');

    if (element.entity.managers) {
      element.entity.managers = (element.entity.managers as any).map((user) => this.userRepository.getReference(user.uuid));
    }

    const uuid = element.entity.uuid;
    if (uuid) {
      const ref = await this.applicationRepository.findOneOrFail({ uuid });
      element.entity = wrap(ref).assign(element.entity);
    } else {
      element.entity = this.applicationRepository.create(element.entity);
    }
    await this.applicationRepository.flush();

    return element.entity as Application;
  }

  /**
   * Remove o Registro
   * @param uuid
   * @param _element
   * @returns
   */
  async delete(uuid: string, _element: EntityProps<Application>): Promise<void> {
    this.logger.verbose('Delete');

    const entity = await this.applicationRepository.findOneOrFail(uuid);
    if (!entity) {
      this.logger.error('Tentativa de remoção de aplicação inexistente');
      throw new UnauthorizedException('This application does not exists');
    }

    await this.applicationRepository.nativeUpdate({ uuid }, { deletedAt: new Date() });
  }
}
