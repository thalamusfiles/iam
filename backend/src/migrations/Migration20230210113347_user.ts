import { Migration } from '@mikro-orm/migrations';

export class Migration20230210113347_user extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table "user" (
        "uuid" varchar(255) not null, 
        "created_at" timestamptz(0) not null, 
        "updated_at" timestamptz(0) not null, 
        "name" varchar(255) not null, 
        "deleted_at" timestamptz(0) null, 
        "deleted_by_uuid" varchar(255) null, 
        
        constraint "user_pkey" primary key ("uuid"), 
        constraint user_name_check check (LENGTH(name) >= 4)
      );`,
    );

    this.addSql(
      'alter table "user" add constraint "user_deleted_by_uuid_foreign" foreign key ("deleted_by_uuid") references "user" ("uuid") on update cascade on delete set null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_deleted_by_uuid_foreign";');

    this.addSql('drop table if exists "user" cascade;');
  }
}
