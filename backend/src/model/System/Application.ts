import { Check, Collection, Entity, Filter, ManyToMany, Property, Unique } from '@mikro-orm/core';
import { IamBaseEntityWithDelete } from '../Base/IamBaseEntityWithDelete';
import { User } from '../User';

@Entity({ schema: 'system' })
@Unique({ properties: ['initials'] })
@Filter({ name: 'deletedAtIsNull', cond: { deletedAt: { $eq: null } }, default: true })
export class Application extends IamBaseEntityWithDelete {
  @Check({ expression: 'LENGTH(initials) >= 3' })
  @Property({ nullable: false })
  initials!: string;

  @Check({ expression: 'LENGTH(name) >= 3' })
  @Property({ nullable: false })
  name!: string;

  @Check({ expression: 'LENGTH(secrect) >= 32' })
  @Property({ nullable: true })
  secrect?: string;

  @Check({ expression: 'LENGTH(description) >= 10' })
  @Property({ nullable: false })
  description!: string;

  @Property({ nullable: false })
  public!: boolean;

  @ManyToMany(() => User)
  managers = new Collection<User>(this);
}
