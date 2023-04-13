import { EntityProperty, MikroORM, UseRequestContext } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { Application } from '../../../model/System/Application';
import { UserToken } from '../../../model/UserToken';
import { DateTime } from 'luxon';
import { MikroORM as PostgreSqlMikroORM } from '@mikro-orm/postgresql';

@Injectable()
export class RequestService {
  private readonly logger = new Logger(RequestService.name);
  private readonly applicationRepository: EntityRepository<Application>;
  private readonly userTokenRepository: EntityRepository<UserToken>;
  private readonly applicationManagersProperty: EntityProperty;

  constructor(private readonly orm: MikroORM) {
    this.logger.log('starting');

    this.applicationRepository = this.orm.em.getRepository(Application);
    this.userTokenRepository = this.orm.em.getRepository(UserToken);

    const applicationMeta = this.orm.getMetadata().get(Application.name);
    this.applicationManagersProperty = applicationMeta.properties.managers;
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

  /**
   * Conta a quantidade de tokens de logins criados por ip
   * @param ip
   * @param minutes
   * @returns
   */
  async countLastNewRegisters(ip: string, minutes: number): Promise<number> {
    const createdGtE = DateTime.now() //
      .plus({ minutes: minutes })
      .toJSDate();

    return this.userTokenRepository.count({ ip, createdAt: { $gte: createdGtE } });
  }

  /**
   * Verifica se o usuário esta associado a aplicação como gerente
   * @param userUuid
   * @param applicationUuid
   * @returns
   */
  async checkUserApplicationPermition(userUuid: string, applicationUuid: string): Promise<boolean> {
    const appUserPivot = this.applicationManagersProperty.pivotTable;
    const join = this.applicationManagersProperty.joinColumns[0];
    const inverseJoin = this.applicationManagersProperty.inverseJoinColumns[0];

    const rs = await (this.orm as PostgreSqlMikroORM).em.raw(
      `select true from "system".${appUserPivot}
      where ${join} = :application_uuid
      and ${inverseJoin} = :user_uuid`,
      {
        application_uuid: applicationUuid,
        user_uuid: userUuid,
      },
    );

    return rs.rows.length > 0;
  }
}
