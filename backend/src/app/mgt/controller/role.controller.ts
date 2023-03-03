import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Role } from '../../../model/Role';
import { JWTGuard } from '../../auth/jwt/jwt.guard';
import { RoleService } from '../service/role.service';
import { CRUDController, EntityProps } from '../types/crud.controller';
import { RequestInfo } from '../types/request-info';
import { UseCaseMGTService } from '../usecase/usecasemgt.service';
import { EntityRoleCreateDto, EntityRoleUpdateDto, FindRolePropsDto } from './dto/role.dto';

@UseGuards(JWTGuard)
@Controller('mgt/role')
export class RoleController implements CRUDController<Role> {
  private readonly logger = new Logger(RoleController.name);

  constructor(private readonly roleService: RoleService, private readonly useCaseService: UseCaseMGTService) {
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

    //TODO: Mover para caso de uso.
    (props.entity as any).application = request.applicationUuid;

    props.user = request.user;
    return this.save(props);
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

    props.user = request.user;
    return this.save(props);
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

  private async save(props: EntityProps<Role>): Promise<EntityProps<Role>> {
    const isUpdate = !!props.entity.uuid;

    this.useCaseService.preValidate(Role, props);

    if (isUpdate) {
      this.useCaseService.preUpdate(Role, props);
    } else {
      this.useCaseService.prePersist(Role, props);
    }
    this.useCaseService.preSave(Role, props);

    const entity = await this.roleService.save(props);

    if (isUpdate) {
      this.useCaseService.postUpdate(Role, props);
    } else {
      this.useCaseService.postPersist(Role, props);
    }
    this.useCaseService.postSave(Role, props);

    return {
      entity: entity,
      user: { uuid: props.user.uuid },
    };
  }
}
