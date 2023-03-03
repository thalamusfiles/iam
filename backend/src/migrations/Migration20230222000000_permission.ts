import { Migration } from '@mikro-orm/migrations';

export class Migration20230222000000_permission extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table "permission" (
        "uuid" uuid not null default uuid_generate_v4(), 
        "created_at" timestamptz(0) not null, 
        "updated_at" timestamptz(0) not null, 
        "created_by_uuid" uuid not null, 
        "updated_by_uuid" uuid not null, 
        "deleted_at" timestamptz(0) null, 
        "deleted_by_uuid" uuid null, 
        "initials" varchar(255) not null, 
        "on" varchar(255) not null, 
        "action" varchar(255) not null, 
        "description" varchar(255) not null, 
        "application_uuid" uuid not null, 
        
        constraint "permission_pkey" primary key ("uuid"), 
        constraint permission_initials_check check (LENGTH(initials) >= 3), 
        constraint permission_on_check check (LENGTH(initials) >= 1), 
        constraint permission_action_check check (LENGTH(initials) >= 1), 
        constraint permission_description_check check (LENGTH(description) >= 10)
      );`,
    );
    this.addSql('alter table "permission" add constraint "permission_application_uuid_initials_unique" unique ("application_uuid", "initials");');

    this.addSql(
      `create table "role_permission" (
        "role_uuid" uuid not null, 
        "permission_uuid" uuid not null, 
        
        constraint "role_permission_pkey" primary key ("role_uuid", "permission_uuid"));`,
    );

    this.addSql(
      'alter table "permission" add constraint "permission_created_by_uuid_foreign" foreign key ("created_by_uuid") references "user" ("uuid") on update cascade;',
    );
    this.addSql(
      'alter table "permission" add constraint "permission_updated_by_uuid_foreign" foreign key ("updated_by_uuid") references "user" ("uuid") on update cascade;',
    );
    this.addSql(
      'alter table "permission" add constraint "permission_deleted_by_uuid_foreign" foreign key ("deleted_by_uuid") references "user" ("uuid") on update cascade on delete set null;',
    );
    this.addSql(
      'alter table "permission" add constraint "permission_application_uuid_foreign" foreign key ("application_uuid") references "system"."application" ("uuid") on update cascade;',
    );

    this.addSql(
      'alter table "role_permission" add constraint "role_permission_role_uuid_foreign" foreign key ("role_uuid") references "role" ("uuid") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "role_permission" add constraint "role_permission_permission_uuid_foreign" foreign key ("permission_uuid") references "permission" ("uuid") on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "role_permission" drop constraint "role_permission_role_uuid_foreign";');

    this.addSql('alter table "role_permission" drop constraint "role_permission_permission_uuid_foreign";');

    this.addSql('drop table if exists "permission" cascade;');
  }
}
