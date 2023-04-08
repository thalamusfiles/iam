import { Check, Collection, Entity, ManyToMany, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { IamBaseEntity } from './Base/IamBaseEntity';
import { Role } from './Role';
import { UserLogin } from './UserLogin';

@Entity({ schema: 'public' })
export class User extends IamBaseEntity {
  @Check({ expression: 'LENGTH(name) >= 4' })
  @Property({ nullable: false, length: 255 })
  name!: string;

  @Property({ nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => User, { nullable: true })
  deletedBy?: User;

  @OneToMany(() => UserLogin, (userLogin) => userLogin.user)
  userLogins = new Collection<UserLogin>(this);

  @ManyToMany(() => Role, 'users', { owner: true, pivotTable: 'user_role' })
  roles = new Collection<Role>(this);
}
