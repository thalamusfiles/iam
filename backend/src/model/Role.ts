import { Check, Collection, Entity, ManyToMany, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { IamBaseEntityWithDelete } from './Base/IamBaseEntityWithDelete';
import { Permission } from './Permission';
import { Application } from './System/Application';
import { User } from './User';

@Entity()
@Unique({ properties: ['application', 'initials'] })
export class Role extends IamBaseEntityWithDelete {
  @ManyToOne(() => Application, { nullable: false })
  application?: Application;

  @Check({ expression: 'LENGTH(initials) >= 3' })
  @Property({ nullable: false })
  initials!: string;

  @Check({ expression: 'LENGTH(name) >= 3' })
  @Property({ nullable: false })
  name!: string;

  @Check({ expression: 'LENGTH(description) >= 10' })
  @Property({ nullable: false })
  description!: string;

  @ManyToMany(() => User, (user) => user.roles)
  users = new Collection<User>(this);

  @ManyToMany(() => Permission, 'roles', { owner: true, pivotTable: 'role_permission' })
  permissions = new Collection<Permission>(this);
}
