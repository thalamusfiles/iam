import { Migration } from '@mikro-orm/migrations';

export class Migration20230210113347 extends Migration {
  async up(): Promise<void> {
    this.addSql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
  }

  async down(): Promise<void> {
    this.addSql('DROP EXTENSION "uuid-ossp";');
  }
}
