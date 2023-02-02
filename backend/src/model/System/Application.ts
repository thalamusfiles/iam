import { Check, Entity, ManyToOne, Property } from '@mikro-orm/core';
import { IamBaseEntityWithUser } from '../Base/IamBaseEntityWithUser';
import { Region } from './Region';

@Entity()
export class Application extends IamBaseEntityWithUser {
  @ManyToOne(() => Region, { nullable: false })
  region?: Region;

  @Check({ expression: 'LENGTH(initials) >= 4' })
  @Property({ nullable: false })
  initials!: string;

  @Check({ expression: 'LENGTH(initials) >= 4' })
  @Property({ nullable: false })
  name!: string;

  @Check({ expression: 'LENGTH(initials) >= 10' })
  @Property({ nullable: false })
  description!: string;

  @Property({ nullable: false })
  privateSSO!: boolean;

  @Property({ nullable: false })
  oneRoleRequired!: boolean;
}
