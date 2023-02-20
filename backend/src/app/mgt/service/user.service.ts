import { EntityRepository, FindOptions /*, wrap*/ } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { User } from '../../../model/User';
import { /*EntityProps,*/ FindProps } from '../types/crud.controller';
import { CRUDService } from '../types/crud.service';

@Injectable()
export class UserService implements CRUDService<User> {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  /**
   * Busca por vários registros
   * @param query
   * @returns
   */
  async find(query?: FindProps<User>): Promise<User[]> {
    this.logger.verbose('Find all');

    const options: FindOptions<User> = {};
    if (query.populate) {
      Object.assign(options, { populate: query.populate });
    }

    return this.userRepository.find(query?.where, options);
  }

  /**
   * Busca o registro pelo seu identificador
   * @param id
   * @param _query
   * @returns
   */
  async findById(id: string, query?: FindProps<User>): Promise<User> {
    this.logger.verbose('Find by Id');

    const options: FindOptions<User> = {};
    if (query.populate) {
      Object.assign(options, { populate: query.populate });
    }

    return this.userRepository.findOne(id, options);
  }

  /**
   * Cria ou atualiza o registro
   * @param element
   * @returns
   */
  async save(/*element: EntityProps<User>*/): Promise<User> {
    this.logger.verbose('Save');

    throw new ServiceUnavailableException('Este módulo não permite a atualização do usuário');

    /*const uuid = element.entity.uuid;
    if (uuid) {
      const ref = this.userRepository.getReference(uuid);
      element.entity = wrap(ref).assign(element.entity);
    } else {
      element.entity = this.userRepository.create(element.entity);
    }
    await this.userRepository.flush();

    return element.entity as User;*/
  }

  /**
   * Remove o Registro
   * @param uuid
   * @param _element
   * @returns
   */
  async delete(/*uuid: string, _element: EntityProps<User>*/): Promise<void> {
    this.logger.verbose('Delete');

    throw new ServiceUnavailableException('Este módulo não permite a remoção do usuário');

    /* Este módulo não permite a remoção do usuário
    const entity = this.userRepository.getReference(uuid);
    return this.userRepository.removeAndFlush(entity);
    */
  }
}
