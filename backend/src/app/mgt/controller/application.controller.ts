import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Application } from '../../../model/System/Application';
import { JWTGuard } from '../../auth/jwt/jwt.guard';
import { ApplicationService } from '../service/application.service';
import { CRUDController, EntityProps } from '../types/crud.controller';
import { UseCaseMGTService } from '../usecases/usecasemgt.service';
import { EntityApplicationCreateDto, EntityApplicationUpdateDto, FindApplicationPropsDto } from './dto/application.dto';

@UseGuards(JWTGuard)
@Controller('mgt/application')
export class ApplicationController implements CRUDController<Application> {
  private readonly logger = new Logger(ApplicationController.name);

  constructor(private readonly applicationService: ApplicationService, private readonly useCaseService: UseCaseMGTService) {}

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
  async create(@Body() props: EntityApplicationCreateDto, @Request() request: { user: any }): Promise<EntityProps<Application>> {
    this.logger.log('Create Application');

    if ((props.entity as any).uuid !== undefined) {
      this.logger.error('Tentativa de criação de registro com uuid informado');
    }

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
  async update(@Param('uuid') uuid: string, @Body() props: EntityApplicationUpdateDto, @Request() request: any): Promise<EntityProps<Application>> {
    this.logger.log('Update Application');

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
  async delete(@Param('uuid') uuid: string, @Body() props: EntityProps<Application>): Promise<void> {
    this.logger.log('Delete Application');

    if (!uuid) {
      this.logger.error('Tentativa de remoção de registro sem uuid informado');
    }
    return this.applicationService.delete(uuid, props);
  }

  private async save(props: EntityProps<Application>): Promise<EntityProps<Application>> {
    const isUpdate = !!props.entity.uuid;

    this.useCaseService.preValidate(Application, props);

    if (isUpdate) {
      this.useCaseService.preUpdate(Application, props);
    } else {
      this.useCaseService.prePersist(Application, props);
    }
    this.useCaseService.preSave(Application, props);

    const entity = await this.applicationService.save(props);

    if (isUpdate) {
      this.useCaseService.postUpdate(Application, props);
    } else {
      this.useCaseService.postPersist(Application, props);
    }
    this.useCaseService.postSave(Application, props);

    return {
      entity: entity,
      user: { uuid: props.user.uuid },
    };
  }
}
