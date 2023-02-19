import { Migration } from '@mikro-orm/migrations';

export class Migration20230211134133 extends Migration {
  async up(): Promise<void> {
    this.addSql(`create table "system"."region_application" (
      "region_uuid" uuid not null, 
      "application_uuid" uuid not null, 
      
      constraint "region_application_pkey" primary key ("region_uuid", "application_uuid")
    );`);

    this.addSql(
      'alter table "system"."region_application" add constraint "region_application_region_uuid_foreign" foreign key ("region_uuid") references "system"."region" ("uuid") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "system"."region_application" add constraint "region_application_application_uuid_foreign" foreign key ("application_uuid") references "system"."application" ("uuid") on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "system"."region_application" cascade;');
  }
}
