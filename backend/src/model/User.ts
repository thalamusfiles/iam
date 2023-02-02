import { Check, Entity, Property } from '@mikro-orm/core';
import { IamBaseEntity } from './Base/IamBaseEntity';

@Entity()
export class User extends IamBaseEntity {
  @Check({ expression: 'LENGTH(initials) >= 4' })
  @Property({ nullable: false })
  name!: string;
}
