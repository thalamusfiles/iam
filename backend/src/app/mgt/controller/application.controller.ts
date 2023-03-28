import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Application } from '../../../model/System/Application';
import { AccessGuard } from '../../auth/passaport/access.guard';
import { ApplicationService } from '../service/application.service';
import { CRUDController, EntityProps } from '../types/crud.controller';
import { RequestInfo } from '../../../commons/request-info';
import { ApplicationNormalizeInitialsUseCase } from '../usecase/application-normalize-initials.usecase';
import { BaseAddCreatedByUseCase } from '../usecase/base-addcreatedby.usecase';
import { BaseAddUpdatedByUseCase } from '../usecase/base-addupdatedby.usecase';
import { UseCaseMGTService } from '../service/usecasemgt.service';
import { EntityApplicationCreateDto, EntityApplicationUpdateDto, FindApplicationPropsDto } from './dto/application.dto';

@UseGuards(AccessGuard)
@Controller('mgt/application')
export class ApplicationController implements CRUDController<Application> {
  private readonly logger = new Logger(ApplicationController.name);

  constructor(private readonly applicationService: ApplicationService, private readonly useCaseService: UseCaseMGTService) {
    this.logger.log('starting');

    this.useCaseService.register(Application, BaseAddCreatedByUseCase);
    this.useCaseService.register(Application, BaseAddUpdatedByUseCase);
    this.useCaseService.register(Application, ApplicationNormalizeInitialsUseCase);
  }

  /**
   * Buscar por várias regiões
   * @param query
   * @returns
   */
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  find(@Query() query?: FindApplicationPropsDto): Promise<Application[]> {
    this.logger.log('Find all');

    return this.applicationService.find(query);
  }

  /**
   * Busca a Região pelo identificador
   */
  @Get(':uuid')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findById(@Param('uuid') uuid: string, @Query() query?: FindApplicationPropsDto): Promise<Application> {
    this.logger.log(`Find By Id ${uuid}`);

    return this.applicationService.findById(uuid, query);
  }

  /**
   * Valida e cria uma nova Região
   * @param props
   * @param request
   * @returns
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { exposeUnsetFields: false } }))
  async create(@Body() props: EntityApplicationCreateDto, @Request() request: RequestInfo): Promise<EntityProps<Application>> {
    this.logger.log('Create Application');

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
    @Body() props: EntityApplicationUpdateDto,
    @Request() request: RequestInfo,
  ): Promise<EntityProps<Application>> {
    this.logger.log('Update Application');

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
  async delete(@Param('uuid') uuid: string, @Body() props: EntityProps<Application>): Promise<void> {
    this.logger.log('Delete Application');

    if (!uuid) {
      this.logger.error('Tentativa de remoção de registro sem uuid informado');
    }
    return this.applicationService.delete(uuid, props);
  }

  private async save(props: EntityProps<Application>, request: RequestInfo): Promise<EntityProps<Application>> {
    props.user = request.user;
    const isUpdate = !!props.entity.uuid;

    this.useCaseService.preValidate(Application, props, request);

    if (isUpdate) {
      this.useCaseService.preUpdate(Application, props, request);
    } else {
      this.useCaseService.prePersist(Application, props, request);
    }
    this.useCaseService.preSave(Application, props, request);

    const entity = await this.applicationService.save(props);

    if (isUpdate) {
      this.useCaseService.postUpdate(Application, props, request);
    } else {
      this.useCaseService.postPersist(Application, props, request);
    }
    this.useCaseService.postSave(Application, props, request);

    return {
      entity: entity,
      user: { uuid: props.user.uuid },
    };
  }
}
