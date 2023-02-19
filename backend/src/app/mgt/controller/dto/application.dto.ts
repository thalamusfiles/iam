import { Exclude, Expose, Type } from 'class-transformer';
import { IsUUID, IsString, IsNotEmpty, IsBooleanString } from 'class-validator';
import { EntityProps } from '../../types/crud.controller';

@Exclude()
class ApplicationCreateDto {
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

  @Expose()
  @IsBooleanString()
  @IsNotEmpty()
  privateSSO!: boolean;

  @Expose()
  @IsBooleanString()
  @IsNotEmpty()
  oneRoleRequired!: boolean;
}

// DTO create Application
export class EntityApplicationCreateDto extends EntityProps<ApplicationCreateDto> {
  @Type(() => ApplicationCreateDto)
  entity: Partial<ApplicationCreateDto>;
}

@Exclude()
class ApplicationUpdateDto {
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

  @Expose()
  @IsBooleanString()
  @IsNotEmpty()
  privateSSO!: boolean;

  @Expose()
  @IsBooleanString()
  @IsNotEmpty()
  oneRoleRequired!: boolean;
}

// DTO update Application
export class EntityApplicationUpdateDto extends EntityProps<ApplicationUpdateDto> {
  @Type(() => ApplicationUpdateDto)
  entity: Partial<ApplicationUpdateDto>;
}
