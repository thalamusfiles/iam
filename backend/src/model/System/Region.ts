import { Check, Collection, Entity, ManyToMany, Property, Unique } from '@mikro-orm/core';
import { IamBaseEntityWithDelete } from '../Base/IamBaseEntityWithDelete';
import { Application } from './Application';

@Entity({ schema: 'system' })
@Unique({ properties: ['initials'] })
export class Region extends IamBaseEntityWithDelete {
  @Check({ expression: 'LENGTH(initials) >= 4' })
  @Property({ nullable: false })
  initials!: string;

  @Check({ expression: 'LENGTH(initials) >= 4' })
  @Property({ nullable: false })
  name!: string;

  @Check({ expression: 'LENGTH(initials) >= 10' })
  @Property({ nullable: false })
  description!: string;

  @ManyToMany(() => Application, 'regions', { owner: true, pivotTable: 'region_application' })
  applications = new Collection<Application>(this);
}
