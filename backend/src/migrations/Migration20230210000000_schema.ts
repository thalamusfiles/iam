import { Migration } from '@mikro-orm/migrations';

export class Migration20230210113347 extends Migration {
  async up(): Promise<void> {
    this.addSql('create schema if not exists "system";');
  }

  async down(): Promise<void> {
    this.addSql('drop schema "system";');
  }
}
