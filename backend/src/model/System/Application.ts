import { Check, Collection, Entity, ManyToMany, Property, Unique } from '@mikro-orm/core';
import { IamBaseEntityWithDelete } from '../Base/IamBaseEntityWithDelete';
import { Region } from './Region';

@Entity({ schema: 'system' })
@Unique({ properties: ['initials'] })
export class Application extends IamBaseEntityWithDelete {
  @Check({ expression: 'LENGTH(initials) >= 4' })
  @Property({ nullable: false })
  initials!: string;

  @Check({ expression: 'LENGTH(name) >= 4' })
  @Property({ nullable: false })
  name!: string;

  @Check({ expression: 'LENGTH(description) >= 10' })
  @Property({ nullable: false })
  description!: string;

  @Property({ nullable: false })
  privateSSO!: boolean;

  @Property({ nullable: false })
  oneRoleRequired!: boolean;

  @ManyToMany(() => Region, (region) => region.applications)
  regions = new Collection<Region>(this);
}
