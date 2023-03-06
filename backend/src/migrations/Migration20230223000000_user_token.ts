import { Migration } from '@mikro-orm/migrations';

export class Migration20230223000000_user_token extends Migration {
  async up(): Promise<void> {
    this.addSql('create schema if not exists "auth";');

    this.addSql(
      `create table "auth"."user_token" (
        "uuid" uuid not null default uuid_generate_v4(), 
        "created_at" timestamptz(0) not null, 
        "updated_at" timestamptz(0) not null, 
        "user_uuid" uuid not null, 
        "login_uuid" uuid not null, 
        "region_uuid" uuid not null, 
        "application_uuid" uuid not null, 
        "ip" varchar(128) null, 
        "user_agent" varchar(255) not null, 
        "scopes" text[] not null, 
        "session_token" varchar(512) not null, 
        "jwt_token" varchar(512) not null, 
        "expires_in" timestamptz(0) null, 
        "deleted_at" timestamptz(0) null, 
        
        constraint "user_token_pkey" primary key ("uuid"), 
        constraint user_token_ip_check check ((LENGTH(ip) >=8 AND LENGTH(ip) <= 15) OR LENGTH(ip) = 39), 
        constraint user_token_session_token_check check (LENGTH(session_token) > 64), 
        constraint user_token_jwt_token_check check (LENGTH(jwt_token) > 64)
      );`,
    );

    this.addSql(
      'ALTER TABLE "auth"."user_token" add constraint "user_token_unique_jwt_token" UNIQUE NULLS NOT DISTINCT ("jwt_token", "deleted_at");',
    );

    this.addSql(
      'ALTER TABLE "auth"."user_token" add constraint "user_token_unique_session_token" UNIQUE NULLS NOT DISTINCT ("session_token", "deleted_at");',
    );

    this.addSql(
      'alter table "auth"."user_token" add constraint "user_token_user_uuid_foreign" foreign key ("user_uuid") references "user" ("uuid") on update cascade;',
    );
    this.addSql(
      'alter table "auth"."user_token" add constraint "user_token_login_uuid_foreign" foreign key ("login_uuid") references "user_login" ("uuid") on update cascade;',
    );
    this.addSql(
      'alter table "auth"."user_token" add constraint "user_token_region_uuid_foreign" foreign key ("region_uuid") references "system"."region" ("uuid") on update cascade;',
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
