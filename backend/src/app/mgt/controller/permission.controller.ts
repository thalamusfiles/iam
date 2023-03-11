import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Permission } from '../../../model/Permission';
import { AccessGuard } from '../../auth/passaport/access.guard';
import { PermissionService } from '../service/permission.service';
import { CRUDController, EntityProps } from '../types/crud.controller';
import { RequestInfo } from '../../../types/request-info';
import { BaseAddCreatedByUseCase } from '../usecase/base-addcreatedby.usecase';
import { BaseAddUpdatedByUseCase } from '../usecase/base-addupdatedby.usecase';
import { PermissionAddAplicationUseCase } from '../usecase/permission-addapplication.usecase';
import { PermissionNormalizeInitialsUseCase } from '../usecase/permission-normalize-initials.usecase';
import { UseCaseMGTService } from '../service/usecasemgt.service';
import { EntityPermissionCreateDto, EntityPermissionUpdateDto, FindPermissionPropsDto } from './dto/permission.dto';

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
   * Buscar por várias regiões
   * @param query
   * @returns
   */
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  find(@Query() query?: FindPermissionPropsDto): Promise<Permission[]> {
    this.logger.log('Find all');

    return this.permissionService.find(query);
  }

  /**
   * Busca a Região pelo identificador
   */
  @Get(':uuid')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findById(@Param('uuid') uuid: string, @Query() query?: FindPermissionPropsDto): Promise<Permission> {
    this.logger.log(`Find By Id ${uuid}`);

    return this.permissionService.findById(uuid, query);
  }

  /**
   * Valida e cria uma nova Região
   * @param props
   * @param request
   * @returns
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { exposeUnsetFields: false } }))
  async create(@Body() props: EntityPermissionCreateDto, @Request() request: RequestInfo): Promise<EntityProps<Permission>> {
    this.logger.log('Create Permission');

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
  async update(
    @Param('uuid') uuid: string,
    @Body() props: EntityPermissionUpdateDto,
    @Request() request: RequestInfo,
  ): Promise<EntityProps<Permission>> {
    this.logger.log('Update Permission');

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
  async delete(@Param('uuid') uuid: string, @Body() props: EntityProps<Permission>): Promise<void> {
    this.logger.log('Delete Permission');

    if (!uuid) {
      this.logger.error('Tentativa de remoção de registro sem uuid informado');
    }
    return this.permissionService.delete(uuid, props);
  }

  private async save(props: EntityProps<Permission>, request: RequestInfo): Promise<EntityProps<Permission>> {
    props.user = request.user;
    const isUpdate = !!props.entity.uuid;

    this.useCaseService.preValidate(Permission, props, request);

    if (isUpdate) {
      this.useCaseService.preUpdate(Permission, props, request);
    } else {
      this.useCaseService.prePersist(Permission, props, request);
    }
    this.useCaseService.preSave(Permission, props, request);

    const entity = await this.permissionService.save(props);

    if (isUpdate) {
      this.useCaseService.postUpdate(Permission, props, request);
    } else {
      this.useCaseService.postPersist(Permission, props, request);
    }
    this.useCaseService.postSave(Permission, props, request);

    return {
      entity: entity,
      user: { uuid: props.user.uuid },
    };
  }
}
