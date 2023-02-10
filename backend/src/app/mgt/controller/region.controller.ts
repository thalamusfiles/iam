import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, Request } from '@nestjs/common';
import { Region } from '../../../model/System/Region';
import { RegionService } from '../service/region.service';
import { CRUDController, EntityProps, FindProps } from '../types/crud.controller';

//@UseGuards(JWTGuard)
@Controller('mgt/region')
export class RegionController implements CRUDController<Region> {
  private readonly logger = new Logger(RegionController.name);

  constructor(private readonly regionService: RegionService) {}

  @Get()
  find(@Query() query?: FindProps<Region>): Promise<Region[]> {
    this.logger.log('Find all');

    return this.regionService.find(query);
  }

  @Get(':uuid')
  async findById(@Param('uuid') uuid: string, @Query() query?: FindProps<Region>): Promise<Region> {
    this.logger.log(`Find By Id ${uuid}`);

    return this.regionService.findById(uuid, query);
  }

  /**
   * Valida e criar uma nova Região
   * @param props
   * @param request
   * @returns
   */
  @Post()
  async create(@Body() props: EntityProps<Region>, @Request() request: { user: any }): Promise<EntityProps<Region>> {
    this.logger.log('Create Region');

    if (props.entity.uuid !== undefined) {
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
  async update(@Param('uuid') uuid: string, @Body() props: EntityProps<Region>, request: any): Promise<EntityProps<Region>> {
    this.logger.log('Update Region');

    if (props.entity.uuid !== uuid) {
      this.logger.error('Tentativa de alteração de registro sem uuid informado');
    }
    props.user = request.user;

    return this.save(props);
  }

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

  @Delete(':uuid')
  async delete(@Param('uuid') uuid: string, @Body() props: EntityProps<Region>): Promise<void> {
    this.logger.log('Delete Region');

    if (uuid !== undefined) {
      this.logger.error('Tentativa de remoção de registro sem uuid informado');
    }
    return this.regionService.delete(uuid, props);
  }

  private async save(props: EntityProps<Region>): Promise<EntityProps<Region>> {
    const rs: EntityProps<Region> = {
      entity: {},
      user: {
        /*id: props.user.id*/
      },
    };

    rs.entity = await this.regionService.save(props);

    return rs;
  }
}
