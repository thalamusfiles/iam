import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { createHmac, randomBytes } from 'crypto';
import iamConfig from '../../../config/iam.config';
import { User } from '../../../model/User';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(@InjectRepository(User) private readonly userRepository: EntityRepository<User>) {}

  /*
  async save({ password, ...auth }: PartOf<Auth>): Promise<Auth> {
    const salt = this.generateRandomString(32);
    const encrypted = AuthService.encrypt(salt, password);

    try {
      return await this.repository.save({
        password: encrypted,
        salt: salt,
        ...auth,
      });
    } catch (e) {
      throw new BadRequestException(
        `There has been an error while registering the user data.
        Check if the username isn't already taken.`,
      );
    }
  }
  */

  async getByLogin(username: string, password: string): Promise<User> {
    const user = this.userRepository.findOne(null);
    if (!user) {
      throw new NotFoundException('User does not exist.');
    }

    const encrypted = AuthService.encrypt(user.salt, password);

    if (encrypted === user.password) {
      delete user.password;
      delete user.salt;
      return user;
    } else {
      throw new BadRequestException('Password incorrect.');
    }
  }

  static encrypt(salt: string, password: string): string {
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
