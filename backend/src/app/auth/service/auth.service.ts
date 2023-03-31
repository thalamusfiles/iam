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

export type LoginInfo = {
  userUuid: string;
  userLoginUuid: string;

  clientId: string;
  userAgent: string;
  ip: string;
  responseType: string;
  redirectUri: string;
  scope: string;

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
      expires_in: jwtConfig.MAX_AGE,
      access_token,
      info,
    };
  }

  async validateAccessToke(accessToken: string): Promise<boolean> {
    const userToken = await this.userTokenRepository.findOne({ accessToken });
    if (userToken?.expiresIn) {
      return DateTime.now() < DateTime.fromJSDate(userToken.expiresIn);
    }
    return false;
  }

  async checkUsernameExists(username: string): Promise<boolean> {
    const userLogin = await this.userLoginRepository.findOne({ username, type: UserLoginType.LOCAL });
    return !!userLogin;
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
      // TOKENS
      sessionToken: appInfo.sessionToken,
      accessToken: appInfo.accessToken,
      expiresIn: appInfo.expiresIn,
    });
    await this.userTokenRepository.flush();
  }

  /*async invalidateSession(sessionId: string): Promise<void> {
    const expiresIn = DateTime.now().minus({ minutes: 30 }).toJSDate();

    await this.userTokenRepository.nativeUpdate({ sessionToken: sessionId }, { expiresIn: expiresIn });
    this.userTokenRepository.flush();
  }*/

  /**
   * Carrega o usuário e verifica seu senha
   * @param username
   * @param password
   * @returns
   */
  private async findLocalUserByLogin(username: string, password: string): Promise<UserLogin> {
    this.logger.verbose('Valida login Local');

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

  private userInfo(user: User, { clientId: application }: LoginInfo): AccessUserInfo {
    return {
      iat: DateTime.now().valueOf(),
      uuid: user.uuid,
      name: user.name,
      applicationLogged: application,
    };
  }

  private generateJwt(user: AccessUserInfo, expiresInSeconds: number): string {
    return this.jwtService.sign(user, { expiresIn: expiresInSeconds });
  }
}
