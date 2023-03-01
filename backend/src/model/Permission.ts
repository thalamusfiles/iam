import { Check, Collection, Entity, ManyToMany, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { IamBaseEntityWithDelete } from './Base/IamBaseEntityWithDelete';
import { Role } from './Role';
import { Application } from './System/Application';

@Entity()
@Unique({ properties: ['application', 'initials'] })
export class Permission extends IamBaseEntityWithDelete {
  @Check({ expression: 'LENGTH(initials) >= 3' })
  @Property({ nullable: false })
  initials!: string;

  @Property({ nullable: false })
  on!: string;

  @Property({ nullable: false })
  action!: string;

  @Check({ expression: 'LENGTH(description) >= 10' })
  @Property({ nullable: false })
  description!: string;

  @ManyToOne(() => Application, { nullable: false })
  application?: Application;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles = new Collection<Role>(this);
}
