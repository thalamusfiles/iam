import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, Request, UseGuards, UsePipes } from '@nestjs/common';
import { Role } from '../../../model/Role';
import { AccessGuard } from '../../auth/passaport/access.guard';
import { RoleService } from '../service/role.service';
import { CRUDController, EntityProps } from '../types/crud.controller';
import { RequestInfo } from '../../../commons/request-info';
import { BaseAddCreatedByUseCase } from '../usecase/base-addcreatedby.usecase';
import { BaseAddUpdatedByUseCase } from '../usecase/base-addupdatedby.usecase';
import { RoleAddAplicationUseCase } from '../usecase/role-addapplication.usecase';
import { RoleNormalizeInitialsUseCase } from '../usecase/role-normalize-initials.usecase';
import { UseCaseMGTService } from '../service/usecasemgt.service';
import { EntityRoleCreateDto, EntityRoleUpdateDto, FindRolePropsDto } from './dto/role.dto';
import { RoleFieldsValidationUseCase } from '../usecase/role-fields-validation.usecase';
import { IamValidationPipe } from '../../../commons/validation.pipe';

@UseGuards(AccessGuard)
@Controller('mgt/role')
export class RoleController implements CRUDController<Role> {
  private readonly logger = new Logger(RoleController.name);

  constructor(private readonly roleService: RoleService, private readonly useCaseService: UseCaseMGTService) {
    this.logger.log('starting');

    this.useCaseService.register(Role, BaseAddCreatedByUseCase);
    this.useCaseService.register(Role, BaseAddUpdatedByUseCase);
    this.useCaseService.register(Role, RoleNormalizeInitialsUseCase);
    this.useCaseService.register(Role, RoleFieldsValidationUseCase);
    this.useCaseService.register(Role, RoleAddAplicationUseCase);
  }

  /**
   * Buscar por várias escpopos/perfis
   * @param query
   * @returns
   */
  @Get()
  @UsePipes(new IamValidationPipe())
  find(@Query() query?: FindRolePropsDto, @Request() request?: RequestInfo): Promise<Role[]> {
    this.logger.log('Find all');

    if (!query.where) query.where = {};
    query.where.application = request.applicationRef;

    return this.roleService.find(query);
  }

  /**
   * Busca o Escopo/Perfil pelo identificador
   */
  @Get(':uuid')
  @UsePipes(new IamValidationPipe())
  async findById(@Param('uuid') uuid: string, @Query() query?: FindRolePropsDto): Promise<Role> {
    this.logger.log(`Find By Id ${uuid}`);

    return this.roleService.findById(uuid, query);
  }

  /**
   * Valida e cria uma nova Escopo/Perfil
   * @param props
   * @param request
   * @returns
   */
  @Post()
  @UsePipes(new IamValidationPipe({ transformOptions: { exposeUnsetFields: false } }))
  async create(@Body() props: EntityRoleCreateDto, @Request() request: RequestInfo): Promise<EntityProps<Role>> {
    this.logger.log('Create Role');

    if ((props.entity as any).uuid !== undefined) {
      this.logger.error('Tentativa de criação de registro com uuid informado');
    }

    return this.save(props, request);
  }

  /**
   * Valida e atualiza a Escopo/Perfil
   * @param uuid
   * @param props
   * @param request
   * @returns
   */
  @Put(':uuid')
  @UsePipes(new IamValidationPipe({ transformOptions: { exposeUnsetFields: false } }))
  async update(@Param('uuid') uuid: string, @Body() props: EntityRoleUpdateDto, @Request() request: RequestInfo): Promise<EntityProps<Role>> {
    this.logger.log('Update Role');

    if (!uuid) {
      this.logger.error('Tentativa de alteração de registro sem uuid informado');
    }
    if (props.entity.uuid !== uuid) {
      this.logger.error('Tentativa de alteração de registro com uuid diferente');
    }

    return this.save(props, request);
  }

  /**
   * Remove a Escopo/Perfil a partir do identificador único
   * @param uuid
   * @param props
   * @returns
   */
  @Delete(':uuid')
  async delete(@Param('uuid') uuid: string, @Body() props: EntityProps<Role>): Promise<void> {
    this.logger.log('Delete Role');

    if (!uuid) {
      this.logger.error('Tentativa de remoção de registro sem uuid informado');
    }
    return this.roleService.delete(uuid, props);
  }

  private async save(props: EntityProps<Role>, request: RequestInfo): Promise<EntityProps<Role>> {
    props.user = request.user;
    const isUpdate = !!props.entity.uuid;

    await this.useCaseService.preValidate(Role, props, request);

    if (isUpdate) {
      await this.useCaseService.preUpdate(Role, props, request);
    } else {
      await this.useCaseService.prePersist(Role, props, request);
    }
    await this.useCaseService.preSave(Role, props, request);

    const entity = await this.roleService.save(props);

    if (isUpdate) {
      await this.useCaseService.postUpdate(Role, props, request);
    } else {
      await this.useCaseService.postPersist(Role, props, request);
    }
    await this.useCaseService.postSave(Role, props, request);

    return {
      entity: entity,
      user: { sub: props.user.sub },
    };
  }
}
