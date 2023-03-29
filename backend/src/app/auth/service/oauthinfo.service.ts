import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { Role } from '../../../model/Role';
import { Application } from '../../../model/System/Application';

@Injectable()
export class OauthInfoService {
  private readonly logger = new Logger(OauthInfoService.name);

  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: EntityRepository<Application>,
    @InjectRepository(Role)
    private readonly roleRepository: EntityRepository<Role>,
  ) {
    this.logger.log('starting');
  }

  /**
   * Busca pelas informações da aplicação(cliente)
   * @param uuid Identificador da aplicação
   * @returns
   */
  async findApplication(uuid: string): Promise<Application> {
    this.logger.verbose('Find all');

    return this.applicationRepository.findOneOrFail({ uuid });
  }

  /**
   * Busca as permissões associadas ao escope e formata suas descrições
   * @param scope Escopos separados por um espaço
   * @returns
   */
  async findScopesInfo(scope: string): Promise<any> {
    this.logger.verbose('Find all');

    const apps: Record<string, Application> = {};
    const appAndRoles: { scope: string; app: Application; role: string }[] = [];
    const scopes: string[] = scope.split(' ').map((scope) => scope.trim());

    for (const scope of scopes) {
      const sepIdex = scope.indexOf('_');
      const app = scope.substring(0, sepIdex);
      const role = scope.substring(sepIdex + 1);

      if (!apps[app]) {
        apps[app] = await this.applicationRepository.findOneOrFail({ initials: app });
      }

      appAndRoles.push({ scope, app: apps[app], role });
    }

    const infos: { scope: string; app: { name: string; description: string } }[] = [];
    for (const appAndRole of appAndRoles) {
      const appRef = this.applicationRepository.getReference(appAndRole.app.uuid);
      const role = await this.roleRepository.findOneOrFail({ application: appRef, initials: appAndRole.role }, { populate: ['permissions'] });

      for (const permission of role.permissions) {
        const info = {
          scope: appAndRole.scope,
          app: { name: appAndRole.app.name, description: appAndRole.app.description },
          permission: { description: permission.description },
        };

        infos.push(info);
      }
    }

    console.log(infos);

    return infos;
  }
}
