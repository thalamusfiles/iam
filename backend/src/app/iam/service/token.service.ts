import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '../../../model/User';
import { UserToken } from '../../../model/UserToken';

export type TokenInfo = {
  uuid?: string;
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
    @InjectRepository(UserToken)
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
    const filters = { user: user, expiresIn: { $gte: new Date() } };
    const tokens = (await this.userTokenRepository.find(filters)) || [];

    return tokens.map((token) => ({
      uuid: token.uuid,
      userAgent: token.userAgent,
      scope: token.scope,
      createdAt: token.createdAt,
      expiresIn: token.createdAt,
    }));
  }

  /**
   * Busca por vários registros
   * @param query
   * @returns
   */
  async findAll(uuid: string, page: number, maxPerPage: number): Promise<TokenInfo[]> {
    this.logger.verbose('User info');

    const user = this.userRepository.getReference(uuid);
    const filters = { user: user };
    const tokens =
      (await this.userTokenRepository.find(filters, {
        filters: { deletedAtIsNull: false },
        limit: maxPerPage,
        offset: page * maxPerPage,
      })) || [];

    return tokens.map((token) => ({
      userAgent: token.userAgent,
      scope: token.scope,
      createdAt: token.createdAt,
      expiresIn: token.createdAt,
    }));
  }
}
