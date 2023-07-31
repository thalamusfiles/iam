import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, Request, UseGuards, UsePipes} from '@nestjs/common';
import { User } from '../../../model/User';
import { AccessGuard } from '../../auth/passaport/access.guard';
import { UserService } from '../service/user.service';
import { CRUDController, EntityProps } from '../types/crud.controller';
import { RequestInfo } from '../../../commons/request-info';
import { BaseAddCreatedByUseCase } from '../usecase/base-addcreatedby.usecase';
import { BaseAddUpdatedByUseCase } from '../usecase/base-addupdatedby.usecase';
import { UseCaseMGTService } from '../service/usecasemgt.service';
import { EntityUserCreateDto, EntityUserUpdateDto, FindUserPropsDto } from './dto/user.dto';
import { IamValidationPipe } from '../../../commons/validation.pipe';

@UseGuards(AccessGuard)
@Controller('mgt/user')
export class UserController implements CRUDController<User> {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService, private readonly useCaseService: UseCaseMGTService) {
    this.useCaseService.register(User, BaseAddCreatedByUseCase);
    this.useCaseService.register(User, BaseAddUpdatedByUseCase);

    this.logger.log('starting');
  }

  /**
   * Buscar por várias usuários
   * @param query
   * @returns
   */
  @Get()
  @UsePipes(new IamValidationPipe())
  find(@Query() query?: FindUserPropsDto): Promise<User[]> {
    this.logger.log('find');

    return this.userService.find(query);
  }

  /**
   * Busca o Usuário pelo identificador
   */
  @Get(':uuid')
  @UsePipes(new IamValidationPipe())
  async findById(@Param('uuid') uuid: string, @Query() query?: FindUserPropsDto): Promise<User> {
    this.logger.log(`findById ${uuid}`);

    return this.userService.findById(uuid, query);
  }

  /**
   * Valida e cria uma nova Usuário
   * @param props
   * @param request
   * @returns
   */
  @Post()
  @UsePipes(new IamValidationPipe({ transformOptions: { exposeUnsetFields: false } }))
  async create(@Body() props: EntityUserCreateDto, @Request() request: RequestInfo): Promise<EntityProps<User>> {
    this.logger.log('create');

    if ((props.entity as any).uuid !== undefined) {
      this.logger.error('Tentativa de criação de registro com uuid informado');
    }

    return this.save(props, request);
  }

  /**
   * Valida e atualiza a usuário
   * @param uuid
   * @param props
   * @param request
   * @returns
   */
  @Put(':uuid')
  @UsePipes(new IamValidationPipe({ transformOptions: { exposeUnsetFields: false } }))
  async update(@Param('uuid') uuid: string, @Body() props: EntityUserUpdateDto, @Request() request: RequestInfo): Promise<EntityProps<User>> {
    this.logger.log('update');

    if (!uuid) {
      this.logger.error('Tentativa de alteração de registro sem uuid informado');
    }
    if (props.entity.uuid !== uuid) {
      this.logger.error('Tentativa de alteração de registro com uuid diferente');
    }

    return this.save(props, request);
  }

  /**
   * Remove a usuário a partir do identificador único
   * @param uuid
   * @param props
   * @returns
   */
  @Delete(':uuid')
  async delete(@Param('uuid') uuid: string, @Body() props: EntityProps<User>): Promise<void> {
    this.logger.log('delete');

    if (!uuid) {
      this.logger.error('Tentativa de remoção de registro sem uuid informado');
    }
    return this.userService.delete(uuid, props);
  }

  private async save(props: EntityProps<User>, request: RequestInfo): Promise<EntityProps<User>> {
    props.user = request.user;
    const isUpdate = !!props.entity.uuid;

    await this.useCaseService.preValidate(User, props, request);

    if (isUpdate) {
      await this.useCaseService.preUpdate(User, props, request);
    } else {
      await this.useCaseService.prePersist(User, props, request);
    }
    await this.useCaseService.preSave(User, props, request);

    const entity = await this.userService.save(/*props*/);

    if (isUpdate) {
      await this.useCaseService.postUpdate(User, props, request);
    } else {
      await this.useCaseService.postPersist(User, props, request);
    }
    await this.useCaseService.postSave(User, props, request);

    return {
      entity: entity,
      user: { sub: props.user.sub },
    };
  }
}
