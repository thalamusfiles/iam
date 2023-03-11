import { Check, Entity, Filter, Index, ManyToOne, Property } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { IamBaseEntity } from './Base/IamBaseEntity';
import { Application } from './System/Application';
import { User } from './User';
import { UserLogin } from './UserLogin';

@Entity({ schema: 'auth' })
@Index({
  name: 'user_token_unique_session_token',
  properties: ['sessionToken', 'deletedAt'],
  expression: `CREATE UNIQUE INDEX "user_token_unique_session_token" ON "auth"."user_token" ("session_token") WHERE (response_type = "cookie" AND "deleted_at" IS NULL)`,
})
@Index({
  name: 'user_token_unique_access_token',
  properties: ['accessToken', 'deletedAt'],
  expression:
    'ALTER TABLE "auth"."user_token" add constraint "user_token_unique_access_token" UNIQUE NULLS NOT DISTINCT ("access_token", "deleted_at")',
})
@Filter({ name: 'deletedAtIsNull', cond: { deletedAt: { $eq: null } }, default: true })
export class UserToken extends IamBaseEntity {
  @ManyToOne(() => User, { nullable: false })
  user!: User;

  @ManyToOne(() => UserLogin, { nullable: false })
  login!: UserLogin;

  @ManyToOne(() => Application, { nullable: false })
  application!: Application; //Oauth client_id

  @Check({ expression: 'LENGTH(ip) >=8' })
  @Property({ nullable: false, length: 128 })
  ip!: string;

  @Property({ nullable: false })
  userAgent!: string;

  @Property({ nullable: false, length: 256 })
  responseType!: string; //Oauth: token code cookie

  @Property({ nullable: false, length: 2048 })
  redirectUri!: string;

  @Property({ nullable: false, length: 2048 })
  scope!: string;

  @Property({ nullable: true, length: 256 })
  codeChallenge?: string;

  @Check({ expression: "code_challenge_method = 'plain' or code_challenge_method = 'S256'" })
  @Property({ nullable: true, length: 16 })
  codeChallengeMethod?: string;

  @Exclude()
  @Check({ expression: 'LENGTH(session_token) > 64' })
  @Property({ nullable: true, length: 512 })
  sessionToken?: string;

  @Exclude()
  @Check({ expression: 'LENGTH(access_token) > 64' })
  @Property({ nullable: false, length: 512 })
  accessToken!: string;

  @Property({ nullable: true })
  expiresIn?: Date;

  @Property({ nullable: true })
  deletedAt?: Date;
}
