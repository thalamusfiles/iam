import { Check, Entity, Index, ManyToOne, Property } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { IamBaseEntity } from './Base/IamBaseEntity';
import { Application } from './System/Application';
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
  properties: ['accessToken', 'deletedAt'],
  expression: 'ALTER TABLE "auth"."user_token" add constraint "user_token_unique_jwt_token" UNIQUE NULLS NOT DISTINCT ("access_token", "deleted_at")',
})
export class UserToken extends IamBaseEntity {
  @ManyToOne(() => User, { nullable: false })
  user!: User;

  @ManyToOne(() => UserLogin, { nullable: false })
  login!: UserLogin;

  @ManyToOne(() => Application, { nullable: false })
  application!: Application; //Oauth client_id

  @Check({ expression: '(LENGTH(ip) >=8 AND LENGTH(ip) <= 15) OR LENGTH(ip) = 39' })
  @Property({ nullable: true, length: 128 })
  ip!: string;

  @Property({ nullable: false })
  userAgent!: string;

  @Property({ nullable: false, length: 256 })
  responseType!: string; //Oauth: token code cookie

  @Property({ nullable: false, length: 2048 })
  redirectUri!: string;

  @Property({ nullable: false, length: 1024 })
  scope!: string[];

  @Property({ nullable: true, length: 256 })
  codeChallenge?: string;

  @Check({ expression: "code_challenge_mfethod = 'plain' or code_challenge_mfethod = 'S256'" })
  @Property({ nullable: true, length: 16 })
  codeChallengeMethod?: string;

  @Exclude()
  @Check({ expression: 'LENGTH(session_token) > 64' })
  @Property({ nullable: false, length: 512 })
  sessionToken!: string;

  @Exclude()
  @Check({ expression: 'LENGTH(jwt_token) > 64' })
  @Property({ nullable: false, length: 512 })
  accessToken!: string;

  @Property({ nullable: true })
  expiresIn?: Date;

  @Property({ nullable: true })
  deletedAt?: Date;
}
