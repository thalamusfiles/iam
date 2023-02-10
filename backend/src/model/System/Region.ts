import { Check, Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { IamBaseEntityWithDelete } from '../Base/IamBaseEntityWithDelete';
import { Application } from './Application';

@Entity({ schema: 'system' })
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

  @OneToMany(() => Application, (app) => app.region)
  applications = new Collection<Application>(this);
}
