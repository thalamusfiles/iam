import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import iamConfig from '../../../config/iam.config';
import { Role } from '../../../model/Role';
import { Application } from '../../../model/System/Application';
import { OauthFieldsDto } from '../controller/dto/auth.dto';
import { CryptService } from './crypt.service';

type ScopeInfo = { scope: string; app: { name: string; description: string }; permission: { description: string } };

@Injectable()
export class OauthInfoService {
  private readonly logger = new Logger(OauthInfoService.name);

  constructor(
    private readonly cryptService: CryptService,
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

  createCallbackUri(redirectUri: string, response_type: string, state: string, code: string): string {
    const types = response_type.split(' ');
    const params = [] as string[];
    if (types.includes('code')) {
      params.push(`code=${code}`);
    }
    if (state) {
      params.push(`state=${state}`);
    }
    return redirectUri + '?' + params.join('&');
  }

  createOauthParams(query: OauthFieldsDto): string {
    const { state, code_challenge, code_challenge_method } = query;

    const baseUrl = `response_type=${query.response_type}&scope=${query.scope}&redirect_uri=${query.redirect_uri}&client_id=${query.client_id}`;
    const params = [] as string[];
    if (state) params.push(`&state=${state}`);
    if (code_challenge) params.push(`&code_challenge=${code_challenge}`);
    if (code_challenge_method) params.push(`&code_challenge_method=${code_challenge_method}`);

    return baseUrl + params.join();
  }

  /**
   * Gera um código para posterior autenticação entre aplicações
   */
  generateAuthorizationCode(): string {
    return this.cryptService.generateRandomString(128);
  }

  /**
   * Encripta o code challenge com um salt
   */
  encriptCodeChallengWithSalt(codeChallenge: string, salt: string): string {
    return this.cryptService.encrypt(iamConfig.IAM_PASS_SECRET_SALT, salt, codeChallenge).substring(0, 256);
  }

  /**
   * Busca as permissões associadas ao escope e formata suas descrições
   * @param scope Escopos separados por um espaço
   * @returns
   */
  async findScopesInfo(scope: string): Promise<ScopeInfo[]> {
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

    const infos: ScopeInfo[] = [];
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

    return infos;
  }
}
