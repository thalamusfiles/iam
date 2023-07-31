import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, Request, UnauthorizedException, UseGuards, UsePipes } from '@nestjs/common';
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
import { IamValidationPipe } from '../../../commons/validation.pipe';
import { ApplicationFieldsValidationUseCase } from '../usecase/application-fields-validation.usecase';
import { RequestService } from '../../auth/service/request.service';
import iamConfig from '../../../config/iam.config';

@UseGuards(AccessGuard)
@Controller('mgt/application')
export class ApplicationController implements CRUDController<Application> {
  private readonly logger = new Logger(ApplicationController.name);

  constructor(
    private readonly applicationService: ApplicationService,
    private readonly useCaseService: UseCaseMGTService,
    private readonly requestService: RequestService,
  ) {
    this.logger.log('starting');

    this.useCaseService.register(Application, BaseAddCreatedByUseCase);
    this.useCaseService.register(Application, BaseAddUpdatedByUseCase);
    this.useCaseService.register(Application, ApplicationNormalizeInitialsUseCase);
    this.useCaseService.register(Application, ApplicationFieldsValidationUseCase);
  }

  /**
   * Buscar por várias aplicações
   * @param query
   * @returns
   */
  @Get()
  @UsePipes(new IamValidationPipe())
  async find(@Query() query?: FindApplicationPropsDto, @Request() request?: RequestInfo): Promise<Application[]> {
    this.logger.log('find');

    // Se não for gerente principal deixa editar apenas as aplicações associadas
    const isMainManager = this.requestService.checkUserApplicationPermition(request.user.sub, iamConfig.MAIN_APP_IAM_MGT_ID);
    if (!isMainManager) {
      if (!query.where) query.where = {};
      query.where.managers = [request.user.sub];
    }

    return this.applicationService.find(query);
  }

  /**
   * Busca a Applicação pelo identificador
   */
  @Get(':uuid')
  @UsePipes(new IamValidationPipe())
  async findById(@Param('uuid') uuid: string, @Query() query?: FindApplicationPropsDto, @Request() request?: RequestInfo): Promise<Application> {
    this.logger.log(`findById ${uuid}`);

    // Se não for gerente principal deixa editar apenas as aplicações associadas
    const isMainManager = this.requestService.checkUserApplicationPermition(request.user.sub, iamConfig.MAIN_APP_IAM_MGT_ID);
    if (!isMainManager) {
      if (!query.where) query.where = {};
      query.where.managers = [request.user.sub];
    }

    return this.applicationService.findById(uuid, query);
  }

  /**
   * Valida e cria uma nova Applicação
   * @param props
   * @param request
   * @returns
   */
  @Post()
  @UsePipes(new IamValidationPipe({ transformOptions: { exposeUnsetFields: false } }))
  async create(@Body() props: EntityApplicationCreateDto, @Request() request: RequestInfo): Promise<EntityProps<Application>> {
    this.logger.log('create');

    if ((props.entity as any).uuid !== undefined) {
      this.logger.error('Tentativa de criação de registro com uuid informado');
    }

    return this.save(props, request);
  }

  /**
   * Valida e atualiza a Applicação
   * @param uuid
   * @param props
   * @param request
   * @returns
   */
  @Put(':uuid')
  @UsePipes(new IamValidationPipe({ transformOptions: { exposeUnsetFields: false } }))
  async update(
    @Param('uuid') uuid: string,
    @Body() props: EntityApplicationUpdateDto,
    @Request() request: RequestInfo,
  ): Promise<EntityProps<Application>> {
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
   * Remove a Applicação a partir do identificador único
   * @param uuid
   * @param props
   * @returns
   */
  @Delete(':uuid')
  async delete(@Param('uuid') uuid: string, @Body() props: EntityProps<Application>, @Request() request?: RequestInfo): Promise<void> {
    this.logger.log('delete');

    if (!uuid) {
      this.logger.error('Tentativa de remoção de registro sem uuid informado');
      throw new UnauthorizedException('Uuid required');
    }

    const isMainManager = this.requestService.checkUserApplicationPermition(request.user.sub, iamConfig.MAIN_APP_IAM_MGT_ID);
    if (!isMainManager) {
      throw new UnauthorizedException('Main manager privilege required');
    }

    return this.applicationService.delete(uuid, props);
  }

  private async save(props: EntityProps<Application>, request: RequestInfo): Promise<EntityProps<Application>> {
    props.user = request.user;
    const isUpdate = !!props.entity.uuid;

    await this.useCaseService.preValidate(Application, props, request);

    if (isUpdate) {
      await this.useCaseService.preUpdate(Application, props, request);
    } else {
      await this.useCaseService.prePersist(Application, props, request);
    }
    this.useCaseService.preSave(Application, props, request);

    const entity = await this.applicationService.save(props);

    if (isUpdate) {
      await this.useCaseService.postUpdate(Application, props, request);
    } else {
      await this.useCaseService.postPersist(Application, props, request);
    }
    await this.useCaseService.postSave(Application, props, request);

    return {
      entity: entity,
      user: { sub: props.user.sub },
    };
  }
}
