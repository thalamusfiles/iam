import { Migration } from '@mikro-orm/migrations';
import appsConfig from '../config/apps.config';
import iamConfig from '../config/iam.config';

export class Migration20230211100000_create_apps extends Migration {
  async up(): Promise<void> {
    await this.upIamSSO();
    await this.upIamMgt();
  }

  async upIamSSO(): Promise<void> {
    // Aplicação Principal (SSO)
    this.addSql(
      `insert into "system"."application" (
        "uuid", "created_at", "updated_at", 
        "created_by_uuid", "updated_by_uuid",
        "initials", "name", "description", "public") 
      values (
        '${appsConfig.MAIN_APP_IAM_ID}', CURRENT_DATE, CURRENT_DATE, 
        '${appsConfig.FIRST_ID}', '${appsConfig.FIRST_ID}',
        '${appsConfig.MAIN_APP_IAM}', '${appsConfig.MAIN_APP_IAM_NAME}', 'Sistema de visualização de acessos', true);`,
    );

    // Associa como gerente das aplicações
    this.addSql(
      `insert into "system"."application_managers" ("application_uuid", "user_uuid")
       values ('${appsConfig.MAIN_APP_IAM_ID}', (select user_uuid from user_login ul where username = '${iamConfig.FIRST_USER_EMAIL}'));`,
    );

    // Cria o vínculo do escopo/perfil com a aplicação
    this.addSql(
      `insert into "role"  (
        uuid, created_at, updated_at, created_by_uuid, updated_by_uuid, 
        application_uuid, initials, "name", description)
      values (
        uuid_generate_v4(), CURRENT_DATE, CURRENT_DATE, '${appsConfig.FIRST_ID}', '${appsConfig.FIRST_ID}',
        '${appsConfig.MAIN_APP_IAM_ID}', '${iamConfig.MAIN_ROLE_IAM}', 'Toda Permissões', 'Todas as permissões do projeto SSO estão vinculadas a este perfil');
    `,
    );

    this.addSql(
      `insert into "permission"  (uuid, created_at, updated_at, created_by_uuid, updated_by_uuid, application_uuid, initials, "on", "action" , description)
    values (
      uuid_generate_v4(), CURRENT_DATE, CURRENT_DATE, '${appsConfig.FIRST_ID}', '${appsConfig.FIRST_ID}',
      '${appsConfig.MAIN_APP_IAM_ID}', '${iamConfig.MAIN_PERMISSION_ME_VIEW_IAM}', 'me', 'view', 'Pode visualizar suas informações pessoais.');`,
    );

    this.addSql(
      `insert into "permission"  (uuid, created_at, updated_at, created_by_uuid, updated_by_uuid, application_uuid, initials, "on", "action" , description)
    values (
      uuid_generate_v4(), CURRENT_DATE, CURRENT_DATE, '${appsConfig.FIRST_ID}', '${appsConfig.FIRST_ID}',
      '${appsConfig.MAIN_APP_IAM_ID}', '${iamConfig.MAIN_PERMISSION_LOGIN_VIEW_IAM}', 'login', 'view', 'Pode visualizar todo seu histório de logins do usuário');`,
    );

    this.addSql(
      `insert into "permission"  (uuid, created_at, updated_at, created_by_uuid, updated_by_uuid, application_uuid, initials, "on", "action" , description)
    values (
      uuid_generate_v4(), CURRENT_DATE, CURRENT_DATE, '${appsConfig.FIRST_ID}', '${appsConfig.FIRST_ID}',
      '${appsConfig.MAIN_APP_IAM_ID}', '${iamConfig.MAIN_PERMISSION_TOKEN_VIEW_IAM}', 'token', 'view', 'Pode visualizar seus logins ativos no sistema');`,
    );

    this.addSql(
      `insert into "permission"  (uuid, created_at, updated_at, created_by_uuid, updated_by_uuid, application_uuid, initials, "on", "action" , description)
    values (
      uuid_generate_v4(), CURRENT_DATE, CURRENT_DATE, '${appsConfig.FIRST_ID}', '${appsConfig.FIRST_ID}',
      '${appsConfig.MAIN_APP_IAM_ID}', '${iamConfig.MAIN_PERMISSION_TOKEN_REMOVE_IAM}', 'token', 'remove', 'Pode remover/desabilitar os logins ativos que estão sendo utilizados pelas aplicações');`,
    );

    this.addSql(`
      INSERT INTO "role_permission"  ("role_uuid", "permission_uuid") 
      SELECT "role".uuid, "permission".uuid FROM "role", "permission"
      WHERE "role".initials = '${iamConfig.MAIN_ROLE_IAM}'
      AND "permission".application_uuid = '${appsConfig.MAIN_APP_IAM_ID}'
    `);
  }

  async upIamMgt(): Promise<void> {
    // Aplicação de gestão do IAM SSO
    this.addSql(
      `insert into "system"."application" (
        "uuid", "created_at", "updated_at", 
        "created_by_uuid", "updated_by_uuid",
        "initials", "name", "description", "public") 
      values (
        '${appsConfig.MAIN_APP_IAM_MGT_ID}', CURRENT_DATE, CURRENT_DATE, 
        '${appsConfig.FIRST_ID}', '${appsConfig.FIRST_ID}',
        '${appsConfig.MAIN_APP_IAM_MGT}', '${appsConfig.MAIN_APP_IAM_MGT_NAME}', 'Description by ${appsConfig.MAIN_APP_IAM_MGT}', false);`,
    );

    // Associa como gerente das aplicações
    this.addSql(
      `insert into "system"."application_managers" ("application_uuid", "user_uuid")
           values ('${appsConfig.MAIN_APP_IAM_MGT_ID}', (select user_uuid from user_login ul where username = '${iamConfig.FIRST_USER_EMAIL}'));`,
    );
  }

  async down(): Promise<void> {
    this.addSql(`delete from "system"."application" where "uuid" = '${appsConfig.MAIN_APP_IAM_MGT_ID}'`);
    this.addSql(`delete from "system"."application" where "uuid" = '${appsConfig.MAIN_APP_IAM_ID}'`);
  }
}
