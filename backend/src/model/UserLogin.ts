import { Check, Entity, Enum, Index, ManyToOne, Property } from '@mikro-orm/core';
import { IamBaseEntity } from './Base/IamBaseEntity';
import { User } from './User';

@Entity({ schema: 'public' })
@Index({
  properties: ['user', 'type', 'deletedAt'],
  name: 'user_login_user_type_deleted_unique',
  expression:
    'ALTER TABLE "user_login" add constraint "user_login_user_type_deleted_unique" UNIQUE NULLS NOT DISTINCT ("user", "type", "deletedAt") ',
})
export class UserLogin extends IamBaseEntity {
  @ManyToOne(() => User, { nullable: true })
  user?: User;

  @Enum({ items: ['local', 'facebook', 'google'] })
  @Property({ nullable: false })
  type!: string;

  @Check({ expression: 'LENGTH(name) = 64' })
  @Property({ nullable: true, length: 64 })
  _salt!: string;

  @Check({ expression: 'LENGTH(name) >= 128' })
  @Property({ nullable: false, length: 512 })
  _password!: string;

  @Property({ nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => User, { nullable: true })
  deletedBy?: User;
}
