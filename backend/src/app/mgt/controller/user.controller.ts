import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { User } from '../../../model/User';
import { JWTGuard } from '../../auth/jwt/jwt.guard';
import { UserService } from '../service/user.service';
import { CRUDController, EntityProps } from '../types/crud.controller';
import { UseCaseMGTService } from '../usecase/usecasemgt.service';
import { EntityUserCreateDto, EntityUserUpdateDto, FindUserPropsDto } from './dto/user.dto';

@UseGuards(JWTGuard)
@Controller('mgt/user')
export class UserController implements CRUDController<User> {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService, private readonly useCaseService: UseCaseMGTService) {
    this.logger.log('initialized');
  }

  /**
   * Buscar por várias regiões
   * @param query
   * @returns
   */
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  find(@Query() query?: FindUserPropsDto): Promise<User[]> {
    this.logger.log('Find all');

    return this.userService.find(query);
  }

  /**
   * Busca a Região pelo identificador
   */
  @Get(':uuid')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findById(@Param('uuid') uuid: string, @Query() query?: FindUserPropsDto): Promise<User> {
    this.logger.log(`Find By Id ${uuid}`);

    return this.userService.findById(uuid, query);
  }

  /**
   * Valida e cria uma nova Região
   * @param props
   * @param request
   * @returns
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { exposeUnsetFields: false } }))
  async create(@Body() props: EntityUserCreateDto, @Request() request: { user: any }): Promise<EntityProps<User>> {
    this.logger.log('Create User');

    if ((props.entity as any).uuid !== undefined) {
      this.logger.error('Tentativa de criação de registro com uuid informado');
    }

    props.user = request.user;
    return this.save(props);
  }

  /**
   * Valida e atualiza a usuário
   * @param uuid
   * @param props
   * @param request
   * @returns
   */
  @Put(':uuid')
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { exposeUnsetFields: false } }))
  async update(@Param('uuid') uuid: string, @Body() props: EntityUserUpdateDto, @Request() request: any): Promise<EntityProps<User>> {
    this.logger.log('Update User');

    if (!uuid) {
      this.logger.error('Tentativa de alteração de registro sem uuid informado');
    }
    if (props.entity.uuid !== uuid) {
      this.logger.error('Tentativa de alteração de registro com uuid diferente');
    }

    props.user = request.user;
    return this.save(props);
  }

  /**
   * Remove a usuário a partir do identificador único
   * @param uuid
   * @param props
   * @returns
   */
  @Delete(':uuid')
  async delete(@Param('uuid') uuid: string, @Body() props: EntityProps<User>): Promise<void> {
    this.logger.log('Delete User');

    if (!uuid) {
      this.logger.error('Tentativa de remoção de registro sem uuid informado');
    }
    return this.userService.delete(/*uuid, props*/);
  }

  private async save(props: EntityProps<User>): Promise<EntityProps<User>> {
    const isUpdate = !!props.entity.uuid;

    this.useCaseService.preValidate(User, props);

    if (isUpdate) {
      this.useCaseService.preUpdate(User, props);
    } else {
      this.useCaseService.prePersist(User, props);
    }
    this.useCaseService.preSave(User, props);

    const entity = await this.userService.save(/*props*/);

    if (isUpdate) {
      this.useCaseService.postUpdate(User, props);
    } else {
      this.useCaseService.postPersist(User, props);
    }
    this.useCaseService.postSave(User, props);

    return {
      entity: entity,
      user: { uuid: props.user.uuid },
    };
  }
}
