import { Exclude, Expose, Type } from 'class-transformer';
import { IsUUID, IsString, IsNotEmpty } from 'class-validator';
import { EntityProps } from '../../types/crud.controller';

@Exclude()
class RegionCreateDto {
  @Expose()
  @IsString()
  initials!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  description!: string;
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
