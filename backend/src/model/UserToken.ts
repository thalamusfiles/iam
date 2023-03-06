import { Check, Entity, Index, ManyToOne, Property } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { IamBaseEntity } from './Base/IamBaseEntity';
import { Application } from './System/Application';
import { Region } from './System/Region';
import { User } from './User';
import { UserLogin } from './UserLogin';

@Entity({ schema: 'auth' })
@Index({
  name: 'user_token_unique_session_token',
  properties: ['sessionToken', 'deletedAt'],
  expression:
    'ALTER TABLE "auth"."user_token" add constraint "user_token_unique_session_token" UNIQUE NULLS NOT DISTINCT ("session_token", "deleted_at")',
})
@Index({
  name: 'user_token_unique_jwt_token',
  properties: ['jwtToken', 'deletedAt'],
  expression: 'ALTER TABLE "auth"."user_token" add constraint "user_token_unique_jwt_token" UNIQUE NULLS NOT DISTINCT ("jwt_token", "deleted_at")',
})
export class UserToken extends IamBaseEntity {
  @ManyToOne(() => User, { nullable: false })
  user!: User;

  @ManyToOne(() => UserLogin, { nullable: false })
  login!: UserLogin;

  @ManyToOne(() => Region, { nullable: false })
  region!: Region;

  @ManyToOne(() => Application, { nullable: false })
  application!: Application;

  @Check({ expression: '(LENGTH(ip) >=8 AND LENGTH(ip) <= 15) OR LENGTH(ip) = 39' })
  @Property({ nullable: true, length: 128 })
  ip!: string;

  @Property({ nullable: false })
  userAgent!: string;

  @Property({ nullable: false, length: 1024 })
  scopes!: string[];

  @Exclude()
  @Check({ expression: 'LENGTH(session_token) > 64' })
  @Property({ nullable: false, length: 512 })
  sessionToken!: string;

  @Exclude()
  @Check({ expression: 'LENGTH(jwt_token) > 64' })
  @Property({ nullable: false, length: 512 })
  jwtToken!: string;

  @Property({ nullable: true })
  expiresIn?: Date;

  @Property({ nullable: true })
  deletedAt?: Date;
}
