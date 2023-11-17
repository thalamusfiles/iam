import { Migration } from '@mikro-orm/migrations';
import appsConfig from '../config/apps.config';

export class Migration20230211100000_create_apps extends Migration {
  async up(): Promise<void> {
    // Register
    this.insertApp(appsConfig.APP_REGISTER_ID, appsConfig.APP_REGISTER, appsConfig.APP_REGISTER_NAME, appsConfig.FIRST_ID, true);

    // Billing
    this.insertApp(appsConfig.APP_BILLING_ID, appsConfig.APP_BILLING, appsConfig.APP_BILLING_NAME, appsConfig.FIRST_ID, true);
    this.insertApp(appsConfig.APP_BILLING_MGT_ID, appsConfig.APP_BILLING_MGT, appsConfig.APP_BILLING_MGT_NAME, appsConfig.FIRST_ID, false);
  }

  insertApp(appUuid: string, initials: string, name: string, userId: string, ispublic: boolean): void {
    // Aplicação de gestão do IAM SSO
    this.addSql(
      `insert into "system"."application" (
        "uuid", "created_at", "updated_at", 
        "created_by_uuid", "updated_by_uuid",
        "initials", "name", "description", "public") 
      values (
        '${appUuid}', CURRENT_DATE, CURRENT_DATE, 
        '${userId}', '${userId}',
        '${initials}', '${name}', 'Description by ${name}', ${ispublic ? 'true' : 'false'});`,
    );
  }

  async down(): Promise<void> {
    this.addSql(`delete from "system"."application" where "uuid" = '${appsConfig.APP_BILLING_ID}'`);
    this.addSql(`delete from "system"."application" where "uuid" = '${appsConfig.APP_REGISTER_ID}'`);
  }
}
