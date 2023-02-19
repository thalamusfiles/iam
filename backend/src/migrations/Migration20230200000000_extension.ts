import { Migration } from '@mikro-orm/migrations';

export class Migration20230200000000_extension extends Migration {
  async up(): Promise<void> {
    this.addSql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
  }

  async down(): Promise<void> {
    this.addSql('DROP EXTENSION "uuid-ossp";');
  }
}
