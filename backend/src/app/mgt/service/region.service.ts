import { EntityRepository, FindOptions, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { Region } from '../../../model/System/Region';
import { EntityProps, FindProps } from '../types/crud.controller';
import { CRUDService } from '../types/crud.service';

@Injectable()
export class RegionService implements CRUDService<Region> {
  private readonly logger = new Logger(RegionService.name);

  constructor(
    @InjectRepository(Region)
    private readonly regionRepository: EntityRepository<Region>,
  ) {}

  /**
   * Busca por vários registros
   * @param query
   * @returns
   */
  async find(query?: FindProps<Region>): Promise<Region[]> {
    this.logger.verbose('Find all');

    const options: FindOptions<Region> = {};
    if (query.populate) {
      Object.assign(options, { populate: query.populate });
    }

    return this.regionRepository.find(query?.where, options);
  }

  /**
   * Busca o registro pelo seu identificador
   * @param id
   * @param _query
   * @returns
   */
  async findById(id: string, query?: FindProps<Region>): Promise<Region> {
    this.logger.verbose('Find by Id');

    const options: FindOptions<Region> = {};
    if (query.populate) {
      Object.assign(options, { populate: query.populate });
    }

    return this.regionRepository.findOne(id, options);
  }

  /**
   * Cria ou atualiza o registro
   * @param element
   * @returns
   */
  async save(element: EntityProps<Region>): Promise<Region> {
    this.logger.verbose('Save');

    const uuid = element.entity.uuid;
    if (uuid) {
      const ref = this.regionRepository.getReference(uuid);
      element.entity = wrap(ref).assign(element.entity);
    } else {
      element.entity = this.regionRepository.create(element.entity);
    }
    await this.regionRepository.flush();

    return element.entity as Region;
  }

  /**
   * Remove o Registro
   * @param uuid
   * @param _element
   * @returns
   */
  async delete(uuid: string, _element: EntityProps<Region>): Promise<void> {
    this.logger.verbose('Delete');

    const entity = this.regionRepository.getReference(uuid);
    return this.regionRepository.removeAndFlush(entity);
  }
}
