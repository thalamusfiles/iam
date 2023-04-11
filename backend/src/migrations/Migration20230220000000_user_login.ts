import { Migration } from '@mikro-orm/migrations';

export class Migration20230220000000_user_login extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table "user_login" (
        "uuid" uuid not null default uuid_generate_v4(), 
        "created_at" timestamptz(0) not null, 
        "updated_at" timestamptz(0) not null, 
        "user_uuid" uuid null, 
        "type" text check ("type" in (\'local\', \'facebook\', \'google\')) not null, 
        "username" varchar(128) null, 
        "_salt" varchar(64) null, 
        "_password" varchar(512) not null, 
        "deleted_at" timestamptz(0) null, 
        "deleted_by_uuid" uuid null, 
        
        constraint "user_login_pkey" primary key ("uuid"), 
        constraint user_login_username_check check(LENGTH(username) >= 6), 
        constraint user_login__salt_check check(LENGTH(_salt) = 64), 
        constraint user_login__password_check check(LENGTH(_password) >= 128)
      );`,
    );
    this.addSql(
      'ALTER TABLE "user_login" add constraint "user_login_unique_type_by_user" UNIQUE NULLS NOT DISTINCT ("user_uuid", "type", "deleted_at");',
    );
    this.addSql('ALTER TABLE "user_login" add constraint "user_login_unique_username" UNIQUE NULLS NOT DISTINCT ("type", "username", "deleted_at");');

    this.addSql(
      'alter table "user_login" add constraint "user_login_user_uuid_foreign" foreign key ("user_uuid") references "user" ("uuid") on update cascade on delete set null;',
    );
    this.addSql(
      'alter table "user_login" add constraint "user_login_deleted_by_uuid_foreign" foreign key ("deleted_by_uuid") references "user" ("uuid") on update cascade on delete set null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user_login" cascade;');

    this.addSql('alter table "user" drop constraint user_name_check;');
    this.addSql('alter table "user" add constraint user_name_check check(LENGTH(name) >= 4);');

    this.addSql('alter table "system"."application" drop constraint application_initials_check;');
    this.addSql('alter table "system"."application" drop constraint application_name_check;');
    this.addSql('alter table "system"."application" drop constraint application_description_check;');
    this.addSql('alter table "system"."application" add constraint application_initials_check check(LENGTH(initials) >= 4);');
    this.addSql('alter table "system"."application" add constraint application_name_check check(LENGTH(initials) >= 4);');
    this.addSql('alter table "system"."application" add constraint application_description_check check(LENGTH(initials) >= 10);');
  }
}
