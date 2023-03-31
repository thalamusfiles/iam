import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '../../../model/User';
import { UserLogin } from '../../../model/UserLogin';

export type UserInfo = {
  name: string;
  logins: Array<{
    type: string;
    username: string;
  }>;
};

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(UserLogin)
    private readonly userLoginRepository: EntityRepository<UserLogin>,
  ) {
    this.logger.log('starting');
  }

  /**
   * Coleta informações do usuário
   * @param query
   * @returns
   */
  async userInfo(uuid: string): Promise<UserInfo> {
    this.logger.verbose('User info');

    const user = await this.userRepository.findOneOrFail({ uuid });
    const logins = (await this.userLoginRepository.find({ user: user })) || [];
    return {
      name: user.name,
      logins: logins.map((login) => ({
        type: login.type,
        username: login.username,
      })),
    };
  }
}
