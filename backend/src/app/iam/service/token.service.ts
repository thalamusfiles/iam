import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { User } from '../../../model/User';
import { UserToken } from '../../../model/UserToken';

export type TokenInfo = {
  uuid?: string;
  applicationName?: string;
  scope: string;
  userAgent: string;
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
  async activeTokensByUser(userUuid: string): Promise<TokenInfo[]> {
    this.logger.verbose('Active tokens');

    const user = this.userRepository.getReference(userUuid);
    const filters = { user: user, expiresIn: { $gte: new Date() } };
    const tokens = (await this.userTokenRepository.find(filters)) || [];

    return tokens.map((token) => ({
      uuid: token.uuid,
      scope: token.scope,
      userAgent: token.userAgent,
      createdAt: token.createdAt,
      expiresIn: token.createdAt,
    }));
  }

  /**
   * Busca por vários registros
   * @param query
   * @returns
   */
  async findAll(userUuid: string, page: number, maxPerPage: number): Promise<TokenInfo[]> {
    this.logger.verbose('All logins');

    const user = this.userRepository.getReference(userUuid);
    const filters = { user: user };
    const tokens =
      (await this.userTokenRepository.find(filters, {
        filters: { deletedAtIsNull: false },
        populate: ['application'],
        limit: maxPerPage,
        offset: page * maxPerPage,
        orderBy: { createdAt: 'DESC' },
      })) || [];

    return tokens.map((token) => ({
      applicationName: token.application?.name,
      scope: token.scope,
      userAgent: token.userAgent,
      createdAt: token.createdAt,
      expiresIn: token.createdAt,
    }));
  }

  /**
   * Remove o Registro
   * @param uuid
   * @param _element
   * @returns
   */
  async delete(userUuid: string, uuid: string): Promise<void> {
    this.logger.verbose('Delete');

    const token = await this.userTokenRepository.findOneOrFail(uuid);
    if (token.user.uuid !== userUuid) {
      this.logger.error('Tentativa de remoção de token de outro usuário');
      throw new UnauthorizedException('This Token does not belong to you');
    }

    return this.userTokenRepository.removeAndFlush(token);
  }
}
