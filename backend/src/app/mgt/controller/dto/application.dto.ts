import { Exclude, Expose, Type } from 'class-transformer';
import { IsUUID, IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';
import { Application } from '../../../../model/System/Application';
import { EntityProps, FindProps } from '../../types/crud.controller';

// DTO find Application
@Exclude()
export class FindApplicationPropsDto extends FindProps<Application> {
  @Expose()
  where?: Partial<Application> | any;

  @Expose()
  @Type(() => String)
  @IsIn(['createdBy', 'updatedBy'], { each: true })
  populate?: Array<string>;
}

@Exclude()
class ApplicationCreateDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  initials: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Expose()
  @IsNotEmpty()
  public: boolean;
}

// DTO create Application
export class EntityApplicationCreateDto extends EntityProps<ApplicationCreateDto> {
  @Type(() => ApplicationCreateDto)
  entity: Partial<ApplicationCreateDto>;
}

@Exclude()
class ApplicationUpdateDto {
  @Expose()
  @IsUUID()
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
  @IsOptional()
  public?: boolean;
}

// DTO update Application
export class EntityApplicationUpdateDto extends EntityProps<ApplicationUpdateDto> {
  @Type(() => ApplicationUpdateDto)
  entity: Partial<ApplicationUpdateDto>;
}
