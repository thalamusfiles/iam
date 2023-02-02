import { ManyToOne } from '@mikro-orm/core';
import { User } from '../User';
import { IamBaseEntity } from './IamBaseEntity';

export abstract class IamBaseEntityWithUser extends IamBaseEntity {
  @ManyToOne(() => User, { nullable: false })
  createdBy?: User;

  @ManyToOne(() => User, { nullable: false })
  updatedBy?: User;
}
