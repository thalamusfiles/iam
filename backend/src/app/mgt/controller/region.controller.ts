import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Region } from '../../../model/System/Region';
import { JWTGuard } from '../../auth/jwt/jwt.guard';
import { RegionService } from '../service/region.service';
import { CRUDController, EntityProps } from '../types/crud.controller';
import { RequestInfo } from '../../../types/request-info';
import { BaseAddCreatedByUseCase } from '../usecase/base-addcreatedby.usecase';
import { BaseAddUpdatedByUseCase } from '../usecase/base-addupdatedby.usecase';
import { RegionNormalizeInitialsUseCase } from '../usecase/region-normalize-initials.usecase';
import { UseCaseMGTService } from '../service/usecasemgt.service';
import { EntityRegionCreateDto, EntityRegionUpdateDto, FindRegionPropsDto } from './dto/region.dto';

@UseGuards(JWTGuard)
@Controller('mgt/region')
export class RegionController implements CRUDController<Region> {
  private readonly logger = new Logger(RegionController.name);

  constructor(private readonly regionService: RegionService, private readonly useCaseService: UseCaseMGTService) {
    this.useCaseService.register(Region, BaseAddCreatedByUseCase);
    this.useCaseService.register(Region, BaseAddUpdatedByUseCase);
    this.useCaseService.register(Region, RegionNormalizeInitialsUseCase);

    this.logger.log('starting');
  }

  /**
   * Buscar por várias regiões
   * @param query
   * @returns
   */
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  find(@Query() query?: FindRegionPropsDto): Promise<Region[]> {
    this.logger.log('Find all');

    return this.regionService.find(query);
  }

  /**
   * Busca a Região pelo identificador
   */
  @Get(':uuid')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findById(@Param('uuid') uuid: string, @Query() query?: FindRegionPropsDto): Promise<Region> {
    this.logger.log(`Find By Id ${uuid}`);

    return this.regionService.findById(uuid, query);
  }

  /**
   * Valida e cria uma nova Região
   * @param props
   * @param request
   * @returns
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { exposeUnsetFields: false } }))
  async create(@Body() props: EntityRegionCreateDto, @Request() request: RequestInfo): Promise<EntityProps<Region>> {
    this.logger.log('Create Region');

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
  async update(@Param('uuid') uuid: string, @Body() props: EntityRegionUpdateDto, @Request() request: RequestInfo): Promise<EntityProps<Region>> {
    this.logger.log('Update Region');

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
  async delete(@Param('uuid') uuid: string, @Body() props: EntityProps<Region>): Promise<void> {
    this.logger.log('Delete Region');

    if (!uuid) {
      this.logger.error('Tentativa de remoção de registro sem uuid informado');
    }
    return this.regionService.delete(uuid, props);
  }

  private async save(props: EntityProps<Region>, request: RequestInfo): Promise<EntityProps<Region>> {
    props.user = request.user;
    const isUpdate = !!props.entity.uuid;

    this.useCaseService.preValidate(Region, props, request);

    if (isUpdate) {
      this.useCaseService.preUpdate(Region, props, request);
    } else {
      this.useCaseService.prePersist(Region, props, request);
    }
    this.useCaseService.preSave(Region, props, request);

    const entity = await this.regionService.save(props);

    if (isUpdate) {
      this.useCaseService.postUpdate(Region, props, request);
    } else {
      this.useCaseService.postPersist(Region, props, request);
    }
    this.useCaseService.postSave(Region, props, request);

    return {
      entity: entity,
      user: { uuid: props.user.uuid },
    };
  }
}
