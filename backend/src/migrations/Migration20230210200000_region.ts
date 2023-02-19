import { Migration } from '@mikro-orm/migrations';

export class Migration20230210200000_region extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table "system"."region" (
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
        
        constraint "region_pkey" primary key ("uuid"), 
        constraint region_initials_check check (LENGTH(initials) >= 3), 
        constraint region_name_check check (LENGTH(name) >= 3), 
        constraint region_description_check check (LENGTH(description) >= 10)
      );`,
    );

    this.addSql(
      'alter table "system"."region" add constraint "region_created_by_uuid_foreign" foreign key ("created_by_uuid") references "user" ("uuid") on update cascade;',
    );
    this.addSql(
      'alter table "system"."region" add constraint "region_updated_by_uuid_foreign" foreign key ("updated_by_uuid") references "user" ("uuid") on update cascade;',
    );
    this.addSql(
      'alter table "system"."region" add constraint "region_deleted_by_uuid_foreign" foreign key ("deleted_by_uuid") references "user" ("uuid") on update cascade on delete set null;',
    );

    this.addSql('alter table "system"."region" add constraint "region_initials_unique" unique ("initials");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "system"."region" cascade;');
  }
}
