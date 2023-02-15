import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Region } from '../../../model/System/Region';
import { JWTGuard } from '../../auth/jwt/jwt.guard';
import { RegionService } from '../service/region.service';
import { CRUDController, EntityProps, FindProps } from '../types/crud.controller';
import { EntityRegionCreateDto, EntityRegionUpdateDto } from './dto/region.dto';

@UseGuards(JWTGuard)
@Controller('mgt/region')
export class RegionController implements CRUDController<Region> {
  private readonly logger = new Logger(RegionController.name);

  constructor(private readonly regionService: RegionService) {}

  /**
   * Buscar por várias regiões
   * @param query
   * @returns
   */
  @Get()
  find(@Query() query?: FindProps<Region>): Promise<Region[]> {
    this.logger.log('Find all');

    return this.regionService.find(query);
  }

  /**
   * Busca a Região pelo identificador
   */
  @Get(':uuid')
  @UseGuards(JWTGuard)
  async findById(@Param('uuid') uuid: string, @Query() query?: FindProps<Region>): Promise<Region> {
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
   * Bulk Save, valida, cria ou atualiza os registros
   * @param propss
   * @param request
   * @returns
   */
  @Put()
  async saveAll(@Body() propss: EntityProps<Region>[], request: any): Promise<EntityProps<Region>[]> {
    this.logger.log('Save All Regions');

    const updated: EntityProps<Region>[] = [];

    for (const props of propss) {
      props.user = request.user;
      updated.push(await this.save(props));
    }

    return updated;
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
    if (props.entity.uuid) {
      props.entity.updatedBy = props.user.uuid;
    } else {
      props.entity.createdBy = props.user.uuid;
      props.entity.updatedBy = props.user.uuid;
    }

    const entity = await this.regionService.save(props);

    return {
      entity: entity,
      user: { uuid: props.user.uuid },
    };
  }
}
