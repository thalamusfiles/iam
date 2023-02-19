import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Region } from '../../../model/System/Region';
import { JWTGuard } from '../../auth/jwt/jwt.guard';
import { RegionService } from '../service/region.service';
import { CRUDController, EntityProps } from '../types/crud.controller';
import { UseCaseMGTService } from '../usecases/usecasemgt.service';
import { EntityRegionCreateDto, EntityRegionUpdateDto, FindRegionPropsDto } from './dto/region.dto';

@UseGuards(JWTGuard)
@Controller('mgt/region')
export class RegionController implements CRUDController<Region> {
  private readonly logger = new Logger(RegionController.name);

  constructor(private readonly regionService: RegionService, private readonly useCaseService: UseCaseMGTService) {}

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
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() props: EntityRegionCreateDto, @Request() request: { user: any }): Promise<EntityProps<Region>> {
    this.logger.log('Create Region');

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
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('uuid') uuid: string, @Body() props: EntityRegionUpdateDto, @Request() request: any): Promise<EntityProps<Region>> {
    this.logger.log('Update Region');

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
  async delete(@Param('uuid') uuid: string, @Body() props: EntityProps<Region>): Promise<void> {
    this.logger.log('Delete Region');

    if (!uuid) {
      this.logger.error('Tentativa de remoção de registro sem uuid informado');
    }
    return this.regionService.delete(uuid, props);
  }

  private async save(props: EntityProps<Region>): Promise<EntityProps<Region>> {
    const isUpdate = !!props.entity.uuid;

    this.useCaseService.preValidate(Region, props);

    if (isUpdate) {
      this.useCaseService.preUpdate(Region, props);
    } else {
      this.useCaseService.prePersist(Region, props);
    }
    this.useCaseService.preSave(Region, props);

    const entity = await this.regionService.save(props);

    if (isUpdate) {
      this.useCaseService.postUpdate(Region, props);
    } else {
      this.useCaseService.postPersist(Region, props);
    }
    this.useCaseService.postSave(Region, props);

    return {
      entity: entity,
      user: { uuid: props.user.uuid },
    };
  }
}
