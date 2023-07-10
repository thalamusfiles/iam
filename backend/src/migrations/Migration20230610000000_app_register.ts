import { Migration } from '@mikro-orm/migrations';
import appsConfig from '../config/app.config';

export class Migration20230211100000_create_apps extends Migration {
  async up(): Promise<void> {
    // Aplicação de registros
    this.addSql(
      `insert into "system"."application" (
        "uuid", "created_at", "updated_at", 
        "created_by_uuid", "updated_by_uuid",
        "initials", "name", "description", "public") 
      values (
        '${appsConfig.APP_REGISTER_ID}', CURRENT_DATE, CURRENT_DATE, 
        '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
        '${appsConfig.APP_REGISTER}', '${appsConfig.APP_REGISTER_NAME}', 'Description by ${appsConfig.APP_REGISTER}', true);`,
    );
  }

  async down(): Promise<void> {
    this.addSql(`delete from "system"."application" where "uuid" = '22222222-2222-2222-2222-222222222222'`);
    this.addSql(`delete from "system"."application" where "uuid" = '11111111-1111-1111-1111-111111111111'`);
  }
}
