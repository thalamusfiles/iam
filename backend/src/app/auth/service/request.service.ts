import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { Application } from '../../../model/System/Application';
import { Region } from '../../../model/System/Region';
import { UserToken } from '../../../model/UserToken';
import { DateTime } from 'luxon';

@Injectable()
export class RequestService {
  private readonly logger = new Logger(RequestService.name);
  private readonly regionRepository: EntityRepository<Region>;
  private readonly applicationRepository: EntityRepository<Application>;
  private readonly userTokenRepository: EntityRepository<UserToken>;

  constructor(readonly orm: MikroORM) {
    this.logger.log('starting');

    this.regionRepository = this.orm.em.getRepository(Region);
    this.applicationRepository = this.orm.em.getRepository(Application);
    this.userTokenRepository = this.orm.em.getRepository(UserToken);
  }

  @UseRequestContext()
  async getRegionRef(initials: string): Promise<Region> {
    const region = await this.regionRepository.findOne({ initials });
    return this.regionRepository.getReference(region.uuid);
  }

  @UseRequestContext()
  async getApplicationRef(uuid: string): Promise<Application> {
    const application = await this.applicationRepository.findOneOrFail({ uuid });
    return this.applicationRepository.getReference(application.uuid);
  }

  @UseRequestContext()
  async checkApplicationClientId(uuid: string): Promise<boolean> {
    const application = await this.applicationRepository.findOne({ uuid });
    return typeof application?.uuid === 'string';
  }

  async countLastNewRegisters(ip: string, minutes: number): Promise<number> {
    const createdGtE = DateTime.now() //
      .plus({ minutes: minutes })
      .toJSDate();

    return this.userTokenRepository.count({ ip, createdAt: { $gte: createdGtE } });
  }
}
