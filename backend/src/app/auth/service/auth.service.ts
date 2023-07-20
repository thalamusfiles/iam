import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DateTime } from 'luxon';
import iamConfig from '../../../config/iam.config';
import jwtConfig from '../../../config/jwt.config';
import { User } from '../../../model/User';
import { UserLogin, UserLoginType } from '../../../model/UserLogin';
import { UserToken } from '../../../model/UserToken';
import { FormException } from '../../../commons/form.exception';
import { AuthLoginRespDto } from '../controller/dto/auth.dto';
import { AccessUserInfo } from '../passaport/access-user-info';
import { CryptService } from './crypt.service';
import { Application } from '../../../model/System/Application';
import { Role } from '../../../model/Role';

export type LoginInfo = {
  userUuid: string;
  userLoginUuid: string;

  clientId: string;
  userAgent: string;
  ip: string;
  responseType: string;
  redirectUri: string;
  scope: string;
  codeChallenge: string;
  codeChallengeMethod: string;

  sessionToken: string;
  accessToken: string;
  expiresIn: Date;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: EntityRepository<User>,
    @InjectRepository(UserLogin) private readonly userLoginRepository: EntityRepository<UserLogin>,
    @InjectRepository(UserToken) private readonly userTokenRepository: EntityRepository<UserToken>,
    @InjectRepository(Application) private readonly applicationRepository: EntityRepository<Application>,
    @InjectRepository(Role) private readonly roleRepository: EntityRepository<Role>,
    private readonly jwtService: JwtService,
    private readonly cryptService: CryptService,
  ) {
    this.logger.log('starting');
  }

  /**
   * Registra um novo usuário no sistema
   * @param props
   * @returns
   */
  async register({ name, username, password }: { name: string; username: string; password: string }): Promise<UserLogin> {
    this.logger.verbose('Registro Local de Usuários');

    // Gera o Salta e o Hash da senha
    const _salt = this.cryptService.generateRandomString(64);
    const _password = this.cryptService.encrypt(iamConfig.IAM_PASS_SECRET_SALT, _salt, password);

    // Registra o Usuário
    const user = this.userRepository.create({ name });
    await this.userLoginRepository.flush();

    // Registrao o login de acesso
    const userLogin = this.userLoginRepository.create({
      user,
      type: UserLoginType.LOCAL,
      username,
      _salt,
      _password,
    });
    await this.userLoginRepository.flush();

    return userLogin;
  }

  /**
   * Remove todos os logins anteriores
   * @param username
   * @param password
   * @returns
   */
  async removeOldTokens(userUuid: string, userAgent: string, ip: string): Promise<void> {
    this.logger.verbose('Remove Old Tokens');

    const user = this.userRepository.getReference(userUuid);
    await this.userTokenRepository.nativeUpdate({ user, userAgent, ip }, { deletedAt: new Date() });
  }

  /**
   * Valida o login e gera o token acesso
   * @param username
   * @param password
   * @returns
   */
  async findAndCreateAccessToken(username: string, password: string, appInfo: LoginInfo): Promise<AuthLoginRespDto> {
    this.logger.verbose('Login Local');

    const userLogin = await this.findLocalUserByLogin(username, password);

    return this.createAccessToken(userLogin.user, userLogin, appInfo);
  }

  /**
   * Carrega o usuário a partir da sessão
   * @param username
   * @param password
   * @returns
   */
  async findLocalUserBySession(sessionToken: string): Promise<UserLogin | null> {
    this.logger.verbose('AuthService.findLocalUserBySession');

    const userToken = await this.userTokenRepository.findOne({ sessionToken }, { populate: ['login', 'login.user'] });

    return userToken?.login || null;
  }

  /**
   * Verifica se o usuário tem permissão para acessar a aplicação se ela não for publica
   * @param userUuid
   * @param clientId
   */
  async verifyApplicationUserAccess(userUuid: string, clientId: string): Promise<void> {
    const application = await this.applicationRepository.findOne({
      $and: [
        { uuid: clientId }, // Aplicação
        {
          $or: [
            { public: true }, // Aplicação publica
            { managers: { $in: [userUuid] } }, // Usuário gerente da aplicação
          ],
        },
      ],
    });
    if (!application) {
      // Verifica se o usuário tem algum perfil na aplicação.
      const role = await this.roleRepository.findOne({ application: clientId, users: { $in: [userUuid] } });
      if (!role) {
        throw new FormException([{ kind: 'username', error: 'server.application_not_public' }]);
      }
    }
  }

  /**
   * Remove o token anterior e gera um novo
   * @param accessToken
   * @returns
   */
  async refreshAccessToken(accessToken: string, appInfo: LoginInfo): Promise<AuthLoginRespDto> {
    const userToken = await this.userTokenRepository.findOne({ accessToken }, { populate: ['application', 'user', 'login'] });

    if (userToken) {
      await this.userTokenRepository.nativeUpdate({ accessToken }, { deletedAt: new Date() });
      this.userTokenRepository.flush();

      appInfo.clientId = userToken.application.uuid;
      appInfo.userAgent = userToken.userAgent;
      appInfo.responseType = userToken.responseType;
      appInfo.redirectUri = userToken.redirectUri;
      appInfo.scope = userToken.scope;

      return this.createAccessToken(userToken.user, userToken.login, appInfo);
    }
    return null;
  }

  /**
   * Cria json com uuids do usuários e o token para acessar os sistemas
   * @param user
   * @param userLogin
   * @param appInfo
   * @returns
   */
  async createAccessToken(user: User, userLogin: UserLogin, appInfo: LoginInfo): Promise<AuthLoginRespDto> {
    const expiresIn = DateTime.now().plus({ seconds: jwtConfig.MAX_AGE }).toJSDate();

    const info = this.userInfo(user, appInfo);
    const access_token = this.generateJwt(info, jwtConfig.MAX_AGE);

    appInfo.userUuid = user.uuid;
    appInfo.userLoginUuid = userLogin.uuid;
    appInfo.accessToken = access_token;
    appInfo.expiresIn = expiresIn;

    return {
      token_type: appInfo.responseType,
      scope: appInfo.scope,
      callbackUri: '',
      expires_in: jwtConfig.MAX_AGE,
      access_token,
      info,
    };
  }

  /**
   * Verifica se o token existe
   * Verifica a data de expiração do token
   * @param accessToken
   * @returns
   */
  async validateAccessToken(accessToken: string): Promise<boolean> {
    const userToken = await this.userTokenRepository.findOne({ accessToken });
    if (userToken?.expiresIn) {
      return DateTime.now() < DateTime.fromJSDate(userToken.expiresIn);
    }
    return false;
  }

  /**
   * Salva o registro do token no banco de dados
   * @param appInfo
   */
  async saveUserToken(appInfo: LoginInfo) {
    this.userTokenRepository.create({
      // USER
      user: this.userRepository.getReference(appInfo.userUuid),
      login: this.userLoginRepository.getReference(appInfo.userLoginUuid),
      // OAUTH
      application: appInfo.clientId,
      ip: appInfo.ip,
      userAgent: appInfo.userAgent,
      responseType: appInfo.responseType,
      redirectUri: appInfo.redirectUri,
      scope: appInfo.scope,
      codeChallenge: appInfo.codeChallenge,
      codeChallengeMethod: appInfo.codeChallengeMethod || null,
      // TOKENS
      sessionToken: appInfo.sessionToken,
      accessToken: appInfo.accessToken,
      expiresIn: appInfo.expiresIn,
    });
    await this.userTokenRepository.flush();
  }

  /**
   * Verifica se o nome do usuário existe
   * @param username
   * @returns
   */
  async checkLocalUsernameExists(username: string): Promise<boolean> {
    const userLogin = await this.userLoginRepository.findOne({ username, type: UserLoginType.LOCAL });
    return !!userLogin;
  }

  /**
   * Carrega o usuário e verifica sua senha
   * @param username
   * @param password
   * @returns
   */
  private async findLocalUserByLogin(username: string, password: string): Promise<UserLogin> {
    this.logger.verbose('AuthService.findLocalUserByLogin');

    const userLogin = await this.userLoginRepository.findOne({ username, type: UserLoginType.LOCAL }, { populate: ['user'] });
    if (!userLogin) {
      throw new FormException([{ kind: 'username', error: 'server.user_not_found' }]);
    }

    const _password = this.cryptService.encrypt(iamConfig.IAM_PASS_SECRET_SALT, userLogin._salt, password);

    if (_password === userLogin._password) {
      return userLogin;
    } else {
      throw new FormException([{ kind: 'password', error: 'server.password_invalid' }]);
    }
  }

  private userInfo(user: User, { clientId }: LoginInfo): AccessUserInfo {
    return {
      iat: DateTime.now().valueOf(),
      uuid: user.uuid,
      name: user.name,
      applicationLogged: clientId,
    };
  }

  private generateJwt(user: AccessUserInfo, expiresInSeconds: number): string {
    return this.jwtService.sign(user, { expiresIn: expiresInSeconds });
  }
}
