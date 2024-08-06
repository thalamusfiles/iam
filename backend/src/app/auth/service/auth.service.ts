import { EntityRepository, FilterQuery } from '@mikro-orm/core';
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
import { IdTokenInfo, isIdTokenInfo } from '../passaport/access-user-info';
import { CryptService } from './crypt.service';
import { Application } from '../../../model/System/Application';
import { Role } from '../../../model/Role';

export type LoginInfo = {
  userUuid: string;
  userLoginUuid: string;
  name: string;
  scope: string;

  clientId: string;
  userAgent: string;
  ip: string;
  responseType: string;
  redirectUri: string;
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

  startLoginInfo(loginInfo: Partial<LoginInfo>): LoginInfo {
    return {
      userUuid: null,
      userLoginUuid: null,
      name: null,
      scope: null,

      clientId: null,
      userAgent: null,
      ip: null,
      responseType: null,
      redirectUri: null,
      codeChallenge: null,
      codeChallengeMethod: null,

      sessionToken: null,
      accessToken: null,
      expiresIn: null,
      ...loginInfo,
    };
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
    await this.userTokenRepository.nativeUpdate({ user, userAgent, ip, name: { $eq: null } }, { deletedAt: new Date() });
  }

  /**
   * Carrega o usuário e verifica sua senha
   * @param username
   * @param password
   * @returns
   */
  public async findUserLoginByUsername(username: string, password: string): Promise<UserLogin> {
    this.logger.verbose('findLocalUserByLogin');

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

  /**
   * Carrega o usuário a partir da sessão
   * @param username
   * @param password
   * @returns
   */
  async findUserTokenBySession(sessionToken: string, scope: string): Promise<UserToken | null> {
    this.logger.verbose('findUserTokenBySession');

    const query: FilterQuery<UserToken> = { sessionToken };
    if (scope !== undefined) {
      query.scope = scope;
    }

    const userToken = await this.userTokenRepository.findOne(query, { populate: ['login', 'login.user'], orderBy: { expiresIn: 'DESC' } });

    return this.validateUserToken(userToken) ? userToken : null;
  }

  /**
   * Carrega o usuário a partir do code challeng
   * @param username
   * @param password
   * @returns
   */
  async findUserTokenByCodeChalleng(codeChallengeEncripted: string): Promise<UserToken | null> {
    this.logger.verbose('findUserTokenByCodeChalleng');

    const userToken = await this.userTokenRepository.findOne({ codeChallenge: codeChallengeEncripted }, { populate: ['user', 'login'] });

    return this.validateUserToken(userToken) ? userToken : null;
  }

  /**
   * Verifica se o usuário tem permissão para acessar a aplicação se ela não for publica
   * @param userUuid
   * @param clientId
   */
  async verifyApplicationUserAccess(userUuid: string, clientId: string): Promise<void> {
    this.logger.verbose('verifyApplicationUserAccess');

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
    this.logger.verbose('refreshAccessToken');

    const userToken = await this.userTokenRepository.findOne({ accessToken }, { populate: ['application', 'user', 'login'] });

    if (userToken) {
      await this.userTokenRepository.nativeUpdate({ accessToken }, { deletedAt: new Date() });
      this.userTokenRepository.flush();

      appInfo.clientId = userToken.application.uuid;
      appInfo.userAgent = userToken.userAgent;
      appInfo.responseType = userToken.responseType;
      appInfo.redirectUri = userToken.redirectUri;
      appInfo.scope = userToken.scope;

      return this.createIdAndAccessToken(userToken.user, userToken.login, appInfo);
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
  async createIdAndAccessToken(user: User, userLogin: UserLogin, appInfo: LoginInfo): Promise<AuthLoginRespDto> {
    this.logger.verbose('createIdAndAccessToken');

    const expiresIn = DateTime.now().plus({ seconds: jwtConfig.MAX_AGE }).toJSDate();

    const id_token = this.createIdToken(user, appInfo.clientId);
    const access_token = this.createAccessToken(user, appInfo.clientId);

    appInfo.userUuid = user.uuid;
    appInfo.userLoginUuid = userLogin.uuid;
    appInfo.accessToken = access_token;
    appInfo.expiresIn = expiresIn;

    return {
      id_token,
      access_token,
      token_type: appInfo.responseType,
      scope: appInfo.scope,
      expires_in: jwtConfig.MAX_AGE,
      callback_uri: '',
    };
  }

  /**
   * Verifica se o token existe
   * Verifica a data de expiração do token
   * @param accessToken
   * @returns
   */
  async validateAccessToken(accessToken: string): Promise<boolean> {
    this.logger.verbose('validateAccessToken');

    const userToken = await this.userTokenRepository.findOne({ accessToken });

    return this.validateUserToken(userToken);
  }

  validateUserToken(userToken: UserToken): boolean {
    this.logger.verbose('validateUserToken');

    const notExpiresIn = DateTime.now() < DateTime.fromJSDate(userToken?.expiresIn);
    return userToken && !userToken?.deletedAt && notExpiresIn;
  }

  /**
   * Salva o registro do token no banco de dados
   * @param loginInfo
   */
  async saveUserToken(loginInfo: LoginInfo) {
    this.logger.verbose('saveUserToken');

    this.userTokenRepository.create({
      // USER
      user: this.userRepository.getReference(loginInfo.userUuid),
      login: loginInfo.userLoginUuid ? this.userLoginRepository.getReference(loginInfo.userLoginUuid) : null,
      name: loginInfo.name,
      scope: loginInfo.scope,
      // OAUTH
      application: loginInfo.clientId,
      ip: loginInfo.ip,
      userAgent: loginInfo.userAgent,
      responseType: loginInfo.responseType,
      redirectUri: loginInfo.redirectUri,
      codeChallenge: loginInfo.codeChallenge,
      codeChallengeMethod: loginInfo.codeChallengeMethod || null,
      // TOKENS
      sessionToken: loginInfo.sessionToken,
      accessToken: loginInfo.accessToken,
      expiresIn: loginInfo.expiresIn,
    });
    await this.userTokenRepository.flush();
  }

  /**
   * Verifica se o nome do usuário existe
   * @param username
   * @returns
   */
  async checkLocalUsernameExists(username: string): Promise<boolean> {
    this.logger.verbose('checkLocalUsernameExists');

    const userLogin = await this.userLoginRepository.findOne({ username, type: UserLoginType.LOCAL });
    return !!userLogin;
  }

  /**
   * Cria o token de acesso da aplicação
   * @param user
   * @param appInfo
   * @returns
   */
  createAccessToken(user: User | IdTokenInfo, clientId: string): string {
    const salt = this.cryptService.encrypt(
      this.cryptService.generateRandomString(12),
      iamConfig.IAM_PASS_SECRET_SALT,
      this.cryptService.generateRandomString(12),
    );

    const info: any = this.userInfo(user, clientId);
    info.salt = salt;

    return this.generateJwt(info, jwtConfig.MAX_AGE);
  }

  /**
   * Cria o ID Token (JWT com as informações do usuário)
   * @param user
   * @param appInfo
   * @returns
   */
  createIdToken(user: User | IdTokenInfo, clientId: string): string {
    const info = this.userInfo(user, clientId);
    return this.generateJwt(info, jwtConfig.MAX_AGE);
  }

  private userInfo(user: User | IdTokenInfo, clientId: string): IdTokenInfo {
    this.logger.verbose('userInfo');

    if (isIdTokenInfo(user)) {
      return user;
    }
    return {
      iss: jwtConfig.ISS,
      iat: DateTime.now().valueOf(),
      //exp: 0,
      sub: user.uuid,
      name: user.name,
      aud: clientId,
    };
  }

  private generateJwt(user: IdTokenInfo, expiresInSeconds: number): string {
    this.logger.verbose('generateJwt');
    return this.jwtService.sign(user, { expiresIn: expiresInSeconds });
  }
}
