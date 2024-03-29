import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, Request, UseGuards, UsePipes } from '@nestjs/common';
import { Permission } from '../../../model/Permission';
import { AccessGuard } from '../../auth/passaport/access.guard';
import { PermissionService } from '../service/permission.service';
import { CRUDController, EntityProps } from '../types/crud.controller';
import { RequestInfo } from '../../../commons/request-info';
import { BaseAddCreatedByUseCase } from '../usecase/base-addcreatedby.usecase';
import { BaseAddUpdatedByUseCase } from '../usecase/base-addupdatedby.usecase';
import { PermissionAddAplicationUseCase } from '../usecase/permission-addapplication.usecase';
import { PermissionNormalizeInitialsUseCase } from '../usecase/permission-normalize-initials.usecase';
import { UseCaseMGTService } from '../service/usecasemgt.service';
import { EntityPermissionCreateDto, EntityPermissionUpdateDto, FindPermissionPropsDto } from './dto/permission.dto';
import { IamValidationPipe } from '../../../commons/validation.pipe';

@UseGuards(AccessGuard)
@Controller('mgt/permission')
export class PermissionController implements CRUDController<Permission> {
  private readonly logger = new Logger(PermissionController.name);

  constructor(private readonly permissionService: PermissionService, private readonly useCaseService: UseCaseMGTService) {
    this.logger.log('starting');

    this.useCaseService.register(Permission, BaseAddCreatedByUseCase);
    this.useCaseService.register(Permission, BaseAddUpdatedByUseCase);
    this.useCaseService.register(Permission, PermissionNormalizeInitialsUseCase);
    this.useCaseService.register(Permission, PermissionAddAplicationUseCase);
  }

  /**
   * Buscar por várias permissões
   * @param query
   * @returns
   */
  @Get()
  @UsePipes(new IamValidationPipe())
  find(@Query() query?: FindPermissionPropsDto, @Request() request?: RequestInfo): Promise<Permission[]> {
    this.logger.log('find');

    if (!query.where) query.where = {};
    query.where.application = request.applicationRef;

    return this.permissionService.find(query);
  }

  /**
   * Busca a Permissão pelo identificador
   */
  @Get(':uuid')
  @UsePipes(new IamValidationPipe())
  async findById(@Param('uuid') uuid: string, @Query() query?: FindPermissionPropsDto, @Request() request?: RequestInfo): Promise<Permission> {
    this.logger.log(`findById ${uuid}`);

    if (!query.where) query.where = {};
    query.where.application = request.applicationRef;

    return this.permissionService.findById(uuid, query);
  }

  /**
   * Valida e cria uma nova Permissão
   * @param props
   * @param request
   * @returns
   */
  @Post()
  @UsePipes(new IamValidationPipe({ transformOptions: { exposeUnsetFields: false } }))
  async create(@Body() props: EntityPermissionCreateDto, @Request() request: RequestInfo): Promise<EntityProps<Permission>> {
    this.logger.log('create');

    if ((props.entity as any).uuid !== undefined) {
      this.logger.error('Tentativa de criação de registro com uuid informado');
    }

    return this.save(props, request);
  }

  /**
   * Valida e atualiza a Permissão
   * @param uuid
   * @param props
   * @param request
   * @returns
   */
  @Put(':uuid')
  @UsePipes(new IamValidationPipe({ transformOptions: { exposeUnsetFields: false } }))
  async update(
    @Param('uuid') uuid: string,
    @Body() props: EntityPermissionUpdateDto,
    @Request() request: RequestInfo,
  ): Promise<EntityProps<Permission>> {
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
   * Remove a Permissão a partir do identificador único
   * @param uuid
   * @param props
   * @returns
   */
  @Delete(':uuid')
  async delete(@Param('uuid') uuid: string, @Body() props: EntityProps<Permission>): Promise<void> {
    this.logger.log('delete');

    if (!uuid) {
      this.logger.error('Tentativa de remoção de registro sem uuid informado');
    }
    return this.permissionService.delete(uuid, props);
  }

  private async save(props: EntityProps<Permission>, request: RequestInfo): Promise<EntityProps<Permission>> {
    props.user = request.user;
    const isUpdate = !!props.entity.uuid;

    await this.useCaseService.preValidate(Permission, props, request);

    if (isUpdate) {
      await this.useCaseService.preUpdate(Permission, props, request);
    } else {
      await this.useCaseService.prePersist(Permission, props, request);
    }
    await this.useCaseService.preSave(Permission, props, request);

    const entity = await this.permissionService.save(props);

    if (isUpdate) {
      await this.useCaseService.postUpdate(Permission, props, request);
    } else {
      await this.useCaseService.postPersist(Permission, props, request);
    }
    await this.useCaseService.postSave(Permission, props, request);

    return {
      entity: entity,
      user: { sub: props.user.sub },
    };
  }
}
