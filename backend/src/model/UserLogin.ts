import { Check, Entity, Enum, Index, ManyToOne, Property } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { IamBaseEntity } from './Base/IamBaseEntity';
import { User } from './User';

@Entity({ schema: 'public' })
@Index({
  properties: ['user', 'type', 'username', 'deletedAt'],
  name: 'user_login_unique',
  expression: 'ALTER TABLE "user_login" add constraint "user_login_unique" UNIQUE NULLS NOT DISTINCT ("user", "type", "username", "deletedAt") ',
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
