import { Migration } from '@mikro-orm/migrations';
import iamConfig from '../config/iam.config';

export class Migration20230211100000_create_region_apps extends Migration {
  async up(): Promise<void> {
    // Região Principal
    this.addSql(
      `insert into "system"."region" (
        "uuid", "created_at", "updated_at", 
        "created_by_uuid", "updated_by_uuid",
        "initials", "name", "description") 
      values (
        '11111111-1111-1111-1111-111111111111', CURRENT_DATE, CURRENT_DATE, 
        '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
        '${iamConfig.MAIN_REGION}', '${iamConfig.MAIN_REGION}', 'Description by ${iamConfig.MAIN_REGION}');`,
    );

    // Aplicação Principal (SSO)
    this.addSql(
      `insert into "system"."application" (
        "uuid", "created_at", "updated_at", 
        "created_by_uuid", "updated_by_uuid",
        "initials", "name", "description", "private_sso", "one_role_required") 
      values (
        '${iamConfig.MAIN_APP_IAM_ID}', CURRENT_DATE, CURRENT_DATE, 
        '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
        '${iamConfig.MAIN_APP_IAM}', '${iamConfig.MAIN_APP_IAM_NAME}', 'Description by ${iamConfig.MAIN_APP_IAM}', false, false);`,
    );

    // Aplicação de gestão do IAM SSO
    this.addSql(
      `insert into "system"."application" (
        "uuid", "created_at", "updated_at", 
        "created_by_uuid", "updated_by_uuid",
        "initials", "name", "description", "private_sso", "one_role_required") 
      values (
        '${iamConfig.MAIN_APP_IAM_MGT_ID}', CURRENT_DATE, CURRENT_DATE, 
        '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
        '${iamConfig.MAIN_APP_IAM_MGT}', '${iamConfig.MAIN_APP_IAM_MGT_NAME}', 'Description by ${iamConfig.MAIN_APP_IAM_MGT}', true, true);`,
    );

    // Cria o vínculo da região com a aplicação
    this.addSql(
      `insert into "system"."region_application" ("region_uuid", "application_uuid") values ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111');`,
    );

    this.addSql(
      `insert into "system"."region_application" ("region_uuid", "application_uuid") values ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');`,
    );
  }

  async down(): Promise<void> {
    this.addSql(
      `delete from "system"."region_application" where "region_uuid" = '11111111-1111-1111-1111-111111111111' and "application_uuid" = '11111111-1111-1111-1111-111111111111'`,
    );
    this.addSql(
      `delete from "system"."region_application" where "region_uuid" = '11111111-1111-1111-1111-111111111111' and "application_uuid" = '22222222-2222-2222-2222-222222222222'`,
    );

    this.addSql(`delete from "system"."application" where "uuid" = '22222222-2222-2222-2222-222222222222'`);
    this.addSql(`delete from "system"."application" where "uuid" = '11111111-1111-1111-1111-111111111111'`);

    this.addSql(`delete from "system"."region" where "uuid" = '11111111-1111-1111-1111-111111111111'`);
  }
}
