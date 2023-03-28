import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { Application } from '../../../model/System/Application';

@Injectable()
export class OauthInfoService {
  private readonly logger = new Logger(OauthInfoService.name);

  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: EntityRepository<Application>,
  ) {
    this.logger.log('starting');
  }

  /**
   * Busca pelas informações da aplicação(cliente)
   * @param query
   * @returns
   */
  async findApplication(uuid: string): Promise<Application> {
    this.logger.verbose('Find all');

    return this.applicationRepository.findOneOrFail({ uuid });
  }
}
