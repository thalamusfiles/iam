import { ManyToOne, Property } from '@mikro-orm/core';
import { User } from '../User';
import { IamBaseEntityWithUser } from './IamBaseEntityWithUser';

export abstract class IamBaseEntityWithDelete extends IamBaseEntityWithUser {
  @Property({ nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => User, { nullable: true })
  deletedBy?: User;
}
