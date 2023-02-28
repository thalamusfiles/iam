import { Check, Collection, Entity, ManyToMany, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { IamBaseEntityWithDelete } from './Base/IamBaseEntityWithDelete';
import { Application } from './System/Application';
import { User } from './User';

@Entity({ schema: 'system' })
@Unique({ properties: ['application', 'initials'] })
export class Role extends IamBaseEntityWithDelete {
  @Check({ expression: 'LENGTH(initials) >= 3' })
  @Property({ nullable: false })
  initials!: string;

  @Check({ expression: 'LENGTH(name) >= 3' })
  @Property({ nullable: false })
  name!: string;

  @Check({ expression: 'LENGTH(description) >= 10' })
  @Property({ nullable: false })
  description!: string;

  @ManyToOne(() => Application, { nullable: true })
  application?: Application;

  @ManyToMany(() => User, (user) => user.roles)
  users = new Collection<User>(this);
}
