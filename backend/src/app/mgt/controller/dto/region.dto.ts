import { Exclude, Expose, Type } from 'class-transformer';
import { IsUUID, IsString, IsNotEmpty, IsIn } from 'class-validator';
import { Region } from '../../../../model/System/Region';
import { EntityProps, FindProps } from '../../types/crud.controller';

// DTO find Region
@Exclude()
export class FindRegionPropsDto extends FindProps<Region> {
  @Expose()
  where?: Partial<Region> | any;

  @Expose()
  @Type(() => String)
  @IsIn(['applications', 'createdBy', 'updatedBy'], { each: true })
  populate?: Array<string>;
}

@Exclude()
class RegionCreateDto {
  @Expose()
  @IsString()
  initials: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  description: string;
}

// DTO create Region
export class EntityRegionCreateDto extends EntityProps<RegionCreateDto> {
  @Type(() => RegionCreateDto)
  entity: Partial<RegionCreateDto>;
}

@Exclude()
class RegionUpdateDto {
  @Expose()
  @IsUUID('4')
  uuid: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  description!: string;
}

// DTO update Region
export class EntityRegionUpdateDto extends EntityProps<RegionUpdateDto> {
  @Type(() => RegionUpdateDto)
  entity: Partial<RegionUpdateDto>;
}
