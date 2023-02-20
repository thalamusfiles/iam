import { Exclude, Expose, Type } from 'class-transformer';
import { IsUUID, IsString, IsNotEmpty, IsIn } from 'class-validator';
import { User } from '../../../../model/User';
import { EntityProps, FindProps } from '../../types/crud.controller';

// DTO find User
@Exclude()
export class FindUserPropsDto extends FindProps<User> {
  @Expose()
  where?: Partial<User> | any;

  @Expose()
  @Type(() => String)
  @IsIn(['roles', 'roles.permissions', 'createdBy', 'updatedBy'], { each: true })
  populate?: Array<string>;
}

@Exclude()
class UserCreateDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;
}

// DTO create User
export class EntityUserCreateDto extends EntityProps<UserCreateDto> {
  @Type(() => UserCreateDto)
  entity: Partial<UserCreateDto>;
}

@Exclude()
class UserUpdateDto {
  @Expose()
  @IsUUID()
  uuid: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  name!: string;
}

// DTO update User
export class EntityUserUpdateDto extends EntityProps<UserUpdateDto> {
  @Type(() => UserUpdateDto)
  entity: Partial<UserUpdateDto>;
}
