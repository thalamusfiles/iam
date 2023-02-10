import { Migration } from '@mikro-orm/migrations';

export class Migration20230210113349_application extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table "system"."application" (
        "uuid" varchar(255) not null, 
        "created_at" timestamptz(0) not null, 
        "updated_at" timestamptz(0) not null, 
        "created_by_uuid" varchar(255) not null, 
        "updated_by_uuid" varchar(255) not null, 
        "deleted_at" timestamptz(0) null, 
        "deleted_by_uuid" varchar(255) null, 
        "region_uuid" varchar(255) not null, 
        "initials" varchar(255) not null, 
        "name" varchar(255) not null, 
        "description" varchar(255) not null, 
        "private_sso" boolean not null, 
        "one_role_required" boolean not null, 
        
        constraint "application_pkey" primary key ("uuid"), 
        constraint application_initials_check check (LENGTH(initials) >= 4), 
        constraint application_name_check check (LENGTH(initials) >= 4), 
        constraint application_description_check check (LENGTH(initials) >= 10)
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
    this.addSql(
      'alter table "system"."application" add constraint "application_region_uuid_foreign" foreign key ("region_uuid") references "system"."region" ("uuid") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "system"."application" drop constraint "application_region_uuid_foreign";');
  }
}
