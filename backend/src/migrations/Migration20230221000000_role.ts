import { Migration } from '@mikro-orm/migrations';

export class Migration20230221000000_role extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table "role" (
        "uuid" uuid not null default uuid_generate_v4(), 
        "created_at" timestamptz(0) not null, 
        "updated_at" timestamptz(0) not null, 
        "created_by_uuid" uuid not null, 
        "updated_by_uuid" uuid not null, 
        "deleted_at" timestamptz(0) null, 
        "deleted_by_uuid" uuid null, 
        "initials" varchar(255) not null, 
        "name" varchar(255) not null, 
        "description" varchar(255) not null, 
        "application_uuid" uuid not null, 
        
        constraint "role_pkey" primary key ("uuid"), 
        constraint role_initials_check check (LENGTH(initials) >= 3), 
        constraint role_name_check check (LENGTH(name) >= 3), 
        constraint role_description_check check (LENGTH(description) >= 10)
      );`,
    );

    this.addSql('alter table "role" add constraint "role_application_uuid_initials_unique" unique ("application_uuid", "initials");');

    this.addSql(
      `create table "user_role" (
        "user_uuid" uuid not null, 
        "role_uuid" uuid not null, 
        
        constraint "user_role_pkey" primary key ("user_uuid", "role_uuid")
      );`,
    );

    this.addSql(
      'alter table "role" add constraint "role_created_by_uuid_foreign" foreign key ("created_by_uuid") references "user" ("uuid") on update cascade;',
    );
    this.addSql(
      'alter table "role" add constraint "role_updated_by_uuid_foreign" foreign key ("updated_by_uuid") references "user" ("uuid") on update cascade;',
    );
    this.addSql(
      'alter table "role" add constraint "role_deleted_by_uuid_foreign" foreign key ("deleted_by_uuid") references "user" ("uuid") on update cascade on delete set null;',
    );
    this.addSql(
      'alter table "role" add constraint "role_application_uuid_foreign" foreign key ("application_uuid") references "system"."application" ("uuid") on update cascade on delete set null;',
    );

    this.addSql(
      'alter table "user_role" add constraint "user_role_user_uuid_foreign" foreign key ("user_uuid") references "user" ("uuid") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "user_role" add constraint "user_role_role_uuid_foreign" foreign key ("role_uuid") references "role" ("uuid") on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "user_role" drop constraint "user_role_role_uuid_foreign";');

    this.addSql('drop table if exists "role" cascade;');

    this.addSql('drop table if exists "user_role" cascade;');
  }
}
