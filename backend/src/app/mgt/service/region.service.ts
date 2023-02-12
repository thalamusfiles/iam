import { EntityRepository, wrap } from '@mikro-orm/core';
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

  async find(query?: FindProps<Region>): Promise<Region[]> {
    this.logger.verbose('Find all');

    return this.regionRepository.find(query?.where);
  }

  async findById(id: string, _query?: FindProps<Region>): Promise<Region> {
    this.logger.verbose('Find by Id');

    return this.regionRepository.getReference(id);
  }

  async save(element: EntityProps<Region>): Promise<Region> {
    this.logger.verbose('Save');
    //const entity = element.entity;
    const entity = this.regionRepository.create(element.entity);

    console.log(entity);
    console.log(entity.createdBy);
    console.log(wrap(entity.createdBy).isInitialized());

    if (entity.uuid) {
      element.entity = this.regionRepository.merge(entity);
    } else {
      element.entity = this.regionRepository.create(entity);
    }
    await this.regionRepository.flush();

    return element.entity as Region;
  }

  async delete(uuid: string, _element: EntityProps<Region>): Promise<void> {
    this.logger.verbose('Delete');

    return this.regionRepository.removeAndFlush({ uuid: uuid });
  }
}
