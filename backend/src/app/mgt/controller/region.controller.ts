import { Controller, Delete, Get, Logger, Param, Post, Put, Request } from '@nestjs/common';
import { Region } from 'src/model/System/Region';
import { RegionService } from '../service/region.service';
import { CRUDController, EntityProps, FindProps } from '../types/crud.controller';

@Controller('mgt/region')
export class RegionController implements CRUDController<Region> {
  private readonly logger = new Logger(RegionController.name);

  constructor(private readonly regionService: RegionService) {}

  @Get()
  find(query?: FindProps<Region>): Promise<Region[]> {
    this.logger.log('Find all');

    return this.regionService.find(query);
  }

  @Get(':uuid')
  async findById(@Param('uuid') uuid: string, query?: FindProps<Region>): Promise<Region> {
    this.logger.log(`Find By Id ${uuid}`);

    return this.regionService.findById(uuid, query);
  }

  @Post()
  async create(props: EntityProps<Region>, @Request() request: { user: any }): Promise<EntityProps<Region>> {
    this.logger.log('Create Region');

    if (props.entity.uuid !== undefined) {
      this.logger.error('Tentativa de criação de registro com uuid informado');
    }
    props.user = request.user;
    return this.save(props);
  }

  @Put(':uuid')
  async update(@Param('uuid') uuid: string, props: EntityProps<Region>, request: any): Promise<EntityProps<Region>> {
    this.logger.log('Update Region');

    if (props.entity.uuid !== uuid) {
      this.logger.error('Tentativa de alteração de registro sem uuid informado');
    }
    props.user = request.user;

    return this.save(props);
  }

  @Put()
  async saveAll(propss: EntityProps<Region>[], request: any): Promise<EntityProps<Region>[]> {
    this.logger.log('Save All Regions');

    const updated: EntityProps<Region>[] = [];

    for (const props of propss) {
      props.user = request.user;
      updated.push(await this.save(props));
    }

    return updated;
  }

  @Delete(':uuid')
  async delete(@Param('uuid') uuid: string, element: EntityProps<Region>): Promise<void> {
    this.logger.log('Delete Region');

    if (uuid !== undefined) {
      this.logger.error('Tentativa de remoção de registro sem uuid informado');
    }
    return this.regionService.delete(uuid, element);
  }

  private async save(props: EntityProps<Region>): Promise<EntityProps<Region>> {
    const rs: EntityProps<Region> = { entity: {}, user: { id: props.user.id } };

    rs.entity = await this.regionService.save(props);

    return rs;
  }
}
