import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Role } from '../../../model/Role';
import { JWTGuard } from '../../auth/jwt/jwt.guard';
import { RoleService } from '../service/role.service';
import { CRUDController, EntityProps } from '../types/crud.controller';
import { RequestInfo } from '../../../types/request-info';
import { BaseAddCreatedByUseCase } from '../usecase/base-addcreatedby.usecase';
import { BaseAddUpdatedByUseCase } from '../usecase/base-addupdatedby.usecase';
import { RoleAddAplicationUseCase } from '../usecase/role-addapplication.usecase';
import { RoleNormalizeInitialsUseCase } from '../usecase/role-normalize-initials.usecase';
import { UseCaseMGTService } from '../usecase/usecasemgt.service';
import { EntityRoleCreateDto, EntityRoleUpdateDto, FindRolePropsDto } from './dto/role.dto';

@UseGuards(JWTGuard)
@Controller('mgt/role')
export class RoleController implements CRUDController<Role> {
  private readonly logger = new Logger(RoleController.name);

  constructor(private readonly roleService: RoleService, private readonly useCaseService: UseCaseMGTService) {
    this.useCaseService.register(Role, BaseAddCreatedByUseCase);
    this.useCaseService.register(Role, BaseAddUpdatedByUseCase);
    this.useCaseService.register(Role, RoleNormalizeInitialsUseCase);
    this.useCaseService.register(Role, RoleAddAplicationUseCase);

    this.logger.log('initialized');
  }

  /**
   * Buscar por várias regiões
   * @param query
   * @returns
   */
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  find(@Query() query?: FindRolePropsDto): Promise<Role[]> {
    this.logger.log('Find all');

    return this.roleService.find(query);
  }

  /**
   * Busca a Região pelo identificador
   */
  @Get(':uuid')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findById(@Param('uuid') uuid: string, @Query() query?: FindRolePropsDto): Promise<Role> {
    this.logger.log(`Find By Id ${uuid}`);

    return this.roleService.findById(uuid, query);
  }

  /**
   * Valida e cria uma nova Região
   * @param props
   * @param request
   * @returns
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { exposeUnsetFields: false } }))
  async create(@Body() props: EntityRoleCreateDto, @Request() request: RequestInfo): Promise<EntityProps<Role>> {
    this.logger.log('Create Role');

    if ((props.entity as any).uuid !== undefined) {
      this.logger.error('Tentativa de criação de registro com uuid informado');
    }

    return this.save(props, request);
  }

  /**
   * Valida e atualiza a região
   * @param uuid
   * @param props
   * @param request
   * @returns
   */
  @Put(':uuid')
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { exposeUnsetFields: false } }))
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
   * Remove a região a partir do identificador único
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

    this.useCaseService.preValidate(Role, props, request);

    if (isUpdate) {
      this.useCaseService.preUpdate(Role, props, request);
    } else {
      this.useCaseService.prePersist(Role, props, request);
    }
    this.useCaseService.preSave(Role, props, request);

    const entity = await this.roleService.save(props);

    if (isUpdate) {
      this.useCaseService.postUpdate(Role, props, request);
    } else {
      this.useCaseService.postPersist(Role, props, request);
    }
    this.useCaseService.postSave(Role, props, request);

    return {
      entity: entity,
      user: { uuid: props.user.uuid },
    };
  }
}
