import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { Application } from '../../../model/System/Application';

@Injectable()
export class RequestService {
  private readonly logger = new Logger(RequestService.name);
  private readonly applicationRepository: EntityRepository<Application>;

  constructor(readonly orm: MikroORM) {
    this.logger.log('initialized');

    this.applicationRepository = this.orm.em.getRepository(Application);
  }

  @UseRequestContext()
  async getApplicationUuid(initials: string): Promise<string> {
    const application = await this.applicationRepository.findOne({ initials });
    return application.uuid;
  }
}
