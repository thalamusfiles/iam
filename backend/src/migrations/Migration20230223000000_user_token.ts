import { Migration } from '@mikro-orm/migrations';

export class Migration20230223000000_user_token extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table "auth"."user_token" (
        "uuid" uuid not null default uuid_generate_v4(), 
        "created_at" timestamptz(0) not null, 
        "updated_at" timestamptz(0) not null, 
        "user_uuid" uuid not null, 
        "login_uuid" uuid not null, 
        "application_uuid" uuid not null, 
        "ip" varchar(128) not null, 
        "user_agent" varchar(255) not null, 
        "response_type" varchar(256) not null, 
        "redirect_uri" varchar(2048) not null, 
        "scope" varchar(2048) not null, 
        "code_challenge" varchar(256) null, 
        "code_challenge_method" varchar(16) null,
        "session_token" varchar(512) null, 
        "access_token" varchar(1024) not null, 
        "expires_in" timestamptz(0) null, 
        "deleted_at" timestamptz(0) null, 
        
        constraint "user_token_pkey" primary key ("uuid"), 
        constraint user_token_ip_check check (LENGTH(ip) >=8), 
        constraint user_token_code_challenge_method_check check (code_challenge_method = \'plain\' or code_challenge_method = \'S256\'), 
        constraint user_token_session_token_check check (LENGTH(session_token) > 64), 
        constraint user_token_access_token_check check (LENGTH(access_token) > 256)
      );`,
    );

    this.addSql(
      'ALTER TABLE "auth"."user_token" add constraint "user_token_unique_jwt_token" UNIQUE NULLS NOT DISTINCT ("access_token", "deleted_at");',
    );
    this.addSql(
      `CREATE UNIQUE INDEX "user_token_unique_session_token" ON "auth"."user_token" ("session_token") WHERE (response_type = 'cookie' AND "deleted_at" IS NULL);`,
    );

    this.addSql(
      'alter table "auth"."user_token" add constraint "user_token_user_uuid_foreign" foreign key ("user_uuid") references "user" ("uuid") on update cascade;',
    );
    this.addSql(
      'alter table "auth"."user_token" add constraint "user_token_login_uuid_foreign" foreign key ("login_uuid") references "user_login" ("uuid") on update cascade;',
    );
    this.addSql(
      'alter table "auth"."user_token" add constraint "user_token_application_uuid_foreign" foreign key ("application_uuid") references "system"."application" ("uuid") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "auth"."user_token" cascade;');

    this.addSql('drop schema "auth";');
  }
}
