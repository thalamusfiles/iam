import { Exclude, Expose, Type } from 'class-transformer';
import { IsUUID, IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';
import { Role } from '../../../../model/Role';
import { EntityProps, FindProps } from '../../types/crud.controller';

// DTO find Role
@Exclude()
export class FindRolePropsDto extends FindProps<Role> {
  @Expose()
  where?: Partial<Role> | any;

  @Expose()
  @Type(() => String)
  @IsIn(['permissions', 'createdBy', 'updatedBy'], { each: true })
  populate?: Array<string>;
}

@Exclude()
class RoleCreateDto {
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
}

// DTO create Role
export class EntityRoleCreateDto extends EntityProps<RoleCreateDto> {
  @Type(() => RoleCreateDto)
  entity: Partial<RoleCreateDto>;
}

@Exclude()
class RoleUpdateDto {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  uuid: string;

  @Expose()
  @IsString()
  @IsOptional()
  initials?: string;

  @Expose()
  @IsString()
  @IsOptional()
  name?: string;

  @Expose()
  @IsString()
  @IsOptional()
  description?: string;
}

// DTO update Role
export class EntityRoleUpdateDto extends EntityProps<RoleUpdateDto> {
  @Type(() => RoleUpdateDto)
  entity: Partial<RoleUpdateDto>;
}
