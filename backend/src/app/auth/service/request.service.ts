import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { Application } from '../../../model/System/Application';

@Injectable()
export class RequestService {
  private readonly logger = new Logger(RequestService.name);

  constructor(@InjectRepository(Application) private readonly applicationRepository: EntityRepository<Application>) {
    this.logger.log('initialized');
  }

  async getApplicationUuid(initials: string): Promise<string> {
    const application = await this.applicationRepository.findOne({ initials });
    return application.uuid;
  }
}
