import { Migration } from '@mikro-orm/migrations';

export class Migration20230210300000_application extends Migration {
  async up(): Promise<void> {
    // System Applicaton
    this.addSql(
      `create table "system"."application" (
        "uuid" uuid default uuid_generate_v4() not null, 
        "created_at" timestamptz(0) not null, 
        "updated_at" timestamptz(0) not null, 
        "created_by_uuid" uuid not null, 
        "updated_by_uuid" uuid not null, 
        "deleted_at" timestamptz(0) null, 
        "deleted_by_uuid" uuid null, 
        "initials" varchar(255) not null, 
        "name" varchar(255) not null, 
        "description" varchar(255) not null, 
        "secrect" varchar(255) null, 
        "public" boolean not null, 
        
        constraint "application_pkey" primary key ("uuid"), 
        constraint application_initials_check check (LENGTH(initials) >= 3), 
        constraint application_name_check check (LENGTH(name) >= 3), 
        constraint application_secrect_check check (LENGTH(secrect) >= 32), 
        constraint application_description_check check (LENGTH(description) >= 10)
      );`,
    );

    this.addSql(
      'alter table "system"."application" add constraint "application_created_by_uuid_foreign" foreign key ("created_by_uuid") references "user" ("uuid") on update cascade;',
    );
    this.addSql(
      'alter table "system"."application" add constraint "application_updated_by_uuid_foreign" foreign key ("updated_by_uuid") references "user" ("uuid") on update cascade;',
    );
    this.addSql(
      'alter table "system"."application" add constraint "application_deleted_by_uuid_foreign" foreign key ("deleted_by_uuid") references "user" ("uuid") on update cascade on delete set null;',
    );

    this.addSql('alter table "system"."application" add constraint "application_initials_unique" unique ("initials");');

    // Managers
    this.addSql(
      `create table "system"."application_managers" (
        "application_uuid" uuid not null, 
        "user_uuid" uuid not null, 
        
        constraint "application_managers_pkey" primary key ("application_uuid", "user_uuid")
      );`,
    );

    this.addSql(
      'alter table "system"."application_managers" add constraint "application_managers_application_uuid_foreign" foreign key ("application_uuid") references "system"."application" ("uuid") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "system"."application_managers" add constraint "application_managers_user_uuid_foreign" foreign key ("user_uuid") references "user" ("uuid") on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "system"."application_managers" cascade;');

    this.addSql('drop table if exists "user" application;');
  }
}
