import { EntityRepository, FindOptions, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { Application } from '../../../model/System/Application';
import { EntityProps, FindProps } from '../types/crud.controller';
import { CRUDService } from '../types/crud.service';

@Injectable()
export class ApplicationService implements CRUDService<Application> {
  private readonly logger = new Logger(ApplicationService.name);

  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: EntityRepository<Application>,
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

    const options: FindOptions<Application> = {};
    if (query.populate) {
      Object.assign(options, { populate: query.populate });
    }

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
    if (query.populate) {
      Object.assign(options, { populate: query.populate });
    }

    return this.applicationRepository.findOne(id);
  }

  /**
   * Cria ou atualiza o registro
   * @param element
   * @returns
   */
  async save(element: EntityProps<Application>): Promise<Application> {
    this.logger.verbose('Save');

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

    const entity = this.applicationRepository.getReference(uuid);
    return this.applicationRepository.removeAndFlush(entity);
  }
}
