import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { Application } from '../../../model/System/Application';
import { Region } from '../../../model/System/Region';

@Injectable()
export class RequestService {
  private readonly logger = new Logger(RequestService.name);
  private readonly regionRepository: EntityRepository<Region>;
  private readonly applicationRepository: EntityRepository<Application>;

  constructor(readonly orm: MikroORM) {
    this.logger.log('initialized');

    this.regionRepository = this.orm.em.getRepository(Region);
    this.applicationRepository = this.orm.em.getRepository(Application);
  }

  @UseRequestContext()
  async getRegionRef(initials: string): Promise<Region> {
    const region = await this.regionRepository.findOne({ initials });
    return this.regionRepository.getReference(region.uuid);
  }

  @UseRequestContext()
  async getApplicationRef(initials: string): Promise<Application> {
    const application = await this.applicationRepository.findOne({ initials });
    return this.applicationRepository.getReference(application.uuid);
  }
}
