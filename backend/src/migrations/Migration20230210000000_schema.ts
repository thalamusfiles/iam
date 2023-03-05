import { Migration } from '@mikro-orm/migrations';

export class Migration20230210000000_schema extends Migration {
  async up(): Promise<void> {
    this.addSql('create schema if not exists "system";');
    this.addSql('create schema if not exists "auth";');
    this.addSql('create schema if not exists "log";');
  }

  async down(): Promise<void> {
    this.addSql('drop schema "system";');
  }
}
