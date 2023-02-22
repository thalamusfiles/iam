import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHmac, randomBytes } from 'crypto';
import iamConfig from '../../../config/iam.config';
import { User } from '../../../model/User';
import { UserLogin, UserLoginType } from '../../../model/UserLogin';
import { JwtUserInfo } from '../jwt/jwt-user-info';

// TODO: Colocar esse tipo em local apropriado
export type AuthLoginResp = {
  access_token: string;
  userInfo: JwtUserInfo;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: EntityRepository<User>,
    @InjectRepository(UserLogin) private readonly userLoginRepository: EntityRepository<UserLogin>,
    private readonly jwtService: JwtService,
  ) {}

  async localRegister(props: { name: string; username: string; password: string }): Promise<UserLogin> {
    this.logger.verbose('Registro Local de Usuários');

    // Gera o Salta e o Hash da ssenha
    const _salt = this.generateRandomString(32);
    const _password = this.encrypt(_salt, props.password);

    // Registra o Usuário
    const user = this.userRepository.create({ name: props.name });
    await this.userLoginRepository.flush();

    // Registrao o login de acesso
    const userLogin = this.userLoginRepository.create({
      user,
      type: UserLoginType.LOCAL,
      username: props.username,
      _salt,
      _password,
    });
    await this.userLoginRepository.flush();

    return userLogin;
  }

  async localLogin(username: string, password: string): Promise<AuthLoginResp> {
    this.logger.verbose('Login Local');

    const user = await this.validateLocalUser(username, password);

    const userInfo = this.userInfo(user);
    const access_token = this.generate(userInfo);
    return { access_token, userInfo };
  }

  /**
   * Carrega o usuário e verifica seu senha
   * @param username
   * @param password
   * @returns
   */
  private async validateLocalUser(username: string, password: string): Promise<User> {
    this.logger.verbose('Valida login Local');

    const userLogin = await this.userLoginRepository.findOne({ username }, { populate: ['user'] });
    if (!userLogin) {
      throw new NotFoundException('User does not exist.');
    }

    const encrypted = this.encrypt(userLogin._salt, password);

    if (encrypted === userLogin._password) {
      return userLogin.user;
    } else {
      throw new BadRequestException('Password incorrect.');
    }
  }

  private userInfo(user: User): JwtUserInfo {
    return {
      uuid: user.uuid,
      name: user.name,
      regionLogged: '',
      applicationLogged: '',
    };
  }

  private generate(user: JwtUserInfo): string {
    return this.jwtService.sign(user);
  }

  /**
   * Gera o Hash da senha a partir de 2 salt e a senha, um aleatório gerado no cadastro e outro fixo e secreto.
   * @param salt
   * @param password
   * @returns
   */
  private encrypt(salt: string, password: string): string {
    const hash = createHmac('sha512', salt + iamConfig.IAM_PASS_SECRET_SALT);
    hash.update(password);
    return hash.digest('hex');
  }

  /**
   * Gera um valor aleatório para ser utilizado como "salt" de senha.
   * @param length
   * @returns
   */
  private generateRandomString(length: number): string {
    return randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }
}
