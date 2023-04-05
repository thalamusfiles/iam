import { Check, Collection, Entity, Filter, ManyToMany, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { IamBaseEntityWithDelete } from './Base/IamBaseEntityWithDelete';
import { Role } from './Role';
import { Application } from './System/Application';

@Entity()
@Unique({ properties: ['application', 'initials'] })
@Filter({ name: 'deletedAtIsNull', cond: { deletedAt: { $eq: null } }, default: true })
export class Permission extends IamBaseEntityWithDelete {
  @Check({ expression: 'LENGTH(initials) >= 3' })
  @Property({ nullable: false })
  initials!: string;

  @Check({ expression: 'LENGTH(initials) >= 1' })
  @Property({ nullable: false })
  on!: string;

  @Check({ expression: 'LENGTH(initials) >= 1' })
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
