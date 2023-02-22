import { Check, Entity, ManyToOne, Property } from '@mikro-orm/core';
import { IamBaseEntity } from './Base/IamBaseEntity';

@Entity({ schema: 'public' })
export class User extends IamBaseEntity {
  @Check({ expression: 'LENGTH(name) >= 4' })
  @Property({ nullable: false, length: 255 })
  name!: string;

  @Property({ nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => User, { nullable: true })
  deletedBy?: User;
}
