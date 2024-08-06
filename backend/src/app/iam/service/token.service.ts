import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { User } from '../../../model/User';
import { UserToken } from '../../../model/UserToken';
import { TokenInfo, TokenPermanentDto } from '../controller/dto/token.dto';

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
   * Busca por todos os tokens ativos
   * @param query
   * @returns
   */
  async activeTokensByUser(userUuid: string): Promise<TokenInfo[]> {
    this.logger.verbose('activeTokensByUser');

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
   * Busca por todos os tokens permanentes
   * @param query
   * @returns
   */
  async permanentTokensByUser(userUuid: string): Promise<Exclude<TokenPermanentDto, 'accessToken'>[]> {
    this.logger.verbose('activeTokensByUser');

    const user = this.userRepository.getReference(userUuid);
    const permFilter: FilterQuery<UserToken> = { user: user, name: { $ne: null } };

    const tokens = (await this.userTokenRepository.find(permFilter)) || [];

    return tokens.map((token) => ({
      uuid: token.uuid,
      name: token.name,
      scope: token.scope,
    }));
  }

  /**
   * Busca por todos os logins realizados
   * @param query
   * @returns
   */
  async findAll(userUuid: string, page: number, maxPerPage: number): Promise<TokenInfo[]> {
    this.logger.verbose('findAll');

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
    this.logger.verbose('delete');

    const token = await this.userTokenRepository.findOneOrFail(uuid);
    if (token.user.uuid !== userUuid) {
      this.logger.error('Tentativa de remoção de token de outro usuário');
      throw new UnauthorizedException('This Token does not belong to you');
    }

    return this.userTokenRepository.removeAndFlush(token);
  }
}
