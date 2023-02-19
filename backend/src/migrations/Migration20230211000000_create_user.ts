import { Migration } from '@mikro-orm/migrations';

export class Migration20230210113347_user extends Migration {
  async up(): Promise<void> {
    // Usuário Admin
    this.addSql(
      `insert into "user" ("uuid", "created_at", "updated_at", "name") values ('11111111-1111-1111-1111-111111111111', CURRENT_DATE, CURRENT_DATE, 'Admin');`,
    );
  }

  async down(): Promise<void> {
    this.addSql(`delete from "user" where "uuid" = '11111111-1111-1111-1111-111111111111'`);
  }
}
