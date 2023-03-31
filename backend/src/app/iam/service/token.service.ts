import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '../../../model/User';
import { UserLogin } from '../../../model/UserLogin';
import { UserToken } from '../../../model/UserToken';

export type TokenInfo = {
  userAgent: string;
  scope: string;
  createdAt: Date;
  expiresIn: Date;
};

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(UserLogin)
    private readonly userTokenRepository: EntityRepository<UserToken>,
  ) {
    this.logger.log('starting');
  }

  /**
   * Busca por vários registros
   * @param query
   * @returns
   */
  async activeTokensByUser(uuid: string): Promise<TokenInfo[]> {
    this.logger.verbose('User info');

    const user = this.userRepository.getReference(uuid);
    const tokens = (await this.userTokenRepository.find({ user: user })) || [];

    return tokens.map((token) => ({
      userAgent: token.userAgent,
      scope: token.scope,
      createdAt: token.createdAt,
      expiresIn: token.createdAt,
    }));
  }
}
