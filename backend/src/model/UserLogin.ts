import { Check, Entity, Enum, Index, ManyToOne, Property } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { IamBaseEntity } from './Base/IamBaseEntity';
import { User } from './User';

@Entity({ schema: 'public' })
@Index({
  name: 'user_login_unique_type_by_user',
  properties: ['user', 'type', 'deletedAt'],
  expression:
    'ALTER TABLE "user_login" add constraint "user_login_unique_type_by_user" UNIQUE NULLS NOT DISTINCT ("user_uuid", "type", "deleted_at")',
})
@Index({
  name: 'user_login_unique_username',
  properties: ['type', 'username', 'deletedAt'],
  expression: 'ALTER TABLE "user_login" add constraint "user_login_unique_username" UNIQUE NULLS NOT DISTINCT ("type", "username", "deleted_at")',
})
export class UserLogin extends IamBaseEntity {
  @ManyToOne(() => User, { nullable: true })
  user!: User;

  @Enum(() => UserLoginType)
  @Property({ nullable: false })
  type!: string;

  @Check({ expression: 'LENGTH(username) >= 6' })
  @Property({ nullable: true, length: 128 })
  username!: string;

  @Exclude()
  @Check({ expression: 'LENGTH(_salt) = 64' })
  @Property({ nullable: true, length: 64 })
  _salt!: string;

  @Exclude()
  @Check({ expression: 'LENGTH(_password) >= 128' })
  @Property({ nullable: false, length: 512 })
  _password!: string;

  @Property({ nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => User, { nullable: true })
  deletedBy?: User;
}

export enum UserLoginType {
  LOCAL = 'local',
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
}
