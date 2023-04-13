import { Migration } from '@mikro-orm/migrations';
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
        '${iamConfig.MAIN_APP_IAM_ID}', CURRENT_DATE, CURRENT_DATE, 
        '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
        '${iamConfig.MAIN_APP_IAM}', '${iamConfig.MAIN_APP_IAM_NAME}', 'Sistema de visualização de acessos', true);`,
    );

    // Cria o vínculo do escopo/perfil com a aplicação
    this.addSql(
      `insert into "role"  (
        uuid, created_at, updated_at, created_by_uuid, updated_by_uuid, 
        application_uuid, initials, "name", description)
      values (
        '11111111-1111-1111-1111-111111111111', CURRENT_DATE, CURRENT_DATE, '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
        '${iamConfig.MAIN_APP_IAM_ID}', '${iamConfig.MAIN_ROLE_IAM}', 'Toda Permissões', 'Todas as permissões do projeto SSO estão vinculadas a este perfil');
    `,
    );

    this.addSql(
      `insert into "permission"  (uuid, created_at, updated_at, created_by_uuid, updated_by_uuid, application_uuid, initials, "on", "action" , description)
    values (
      '11111111-1111-1111-1111-111111111111', CURRENT_DATE, CURRENT_DATE, '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
      '${iamConfig.MAIN_APP_IAM_ID}', '${iamConfig.MAIN_PERMISSION_ME_VIEW_IAM}', 'me', 'view', 'Pode visualizar suas informações pessoais.');`,
    );

    this.addSql(
      `insert into "permission"  (uuid, created_at, updated_at, created_by_uuid, updated_by_uuid, application_uuid, initials, "on", "action" , description)
    values (
      '11111111-1111-1111-1111-222222222222', CURRENT_DATE, CURRENT_DATE, '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
      '${iamConfig.MAIN_APP_IAM_ID}', '${iamConfig.MAIN_PERMISSION_LOGIN_VIEW_IAM}', 'login', 'view', 'Pode visualizar todo seu histório de logins do usuário');`,
    );

    this.addSql(
      `insert into "permission"  (uuid, created_at, updated_at, created_by_uuid, updated_by_uuid, application_uuid, initials, "on", "action" , description)
    values (
      '11111111-1111-1111-1111-333333333333', CURRENT_DATE, CURRENT_DATE, '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
      '${iamConfig.MAIN_APP_IAM_ID}', '${iamConfig.MAIN_PERMISSION_TOKEN_VIEW_IAM}', 'token', 'view', 'Pode visualizar seus logins ativos no sistema');`,
    );

    this.addSql(
      `insert into "permission"  (uuid, created_at, updated_at, created_by_uuid, updated_by_uuid, application_uuid, initials, "on", "action" , description)
    values (
      '11111111-1111-1111-1111-444444444444', CURRENT_DATE, CURRENT_DATE, '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
      '${iamConfig.MAIN_APP_IAM_ID}', '${iamConfig.MAIN_PERMISSION_TOKEN_REMOVE_IAM}', 'token', 'remove', 'Pode remover/desabilitar os logins ativos que estão sendo utilizados pelas aplicações');`,
    );

    this.addSql(`
      insert into "role_permission"  ("role_uuid", "permission_uuid") values ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111');
      insert into "role_permission"  ("role_uuid", "permission_uuid") values ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-222222222222');
      insert into "role_permission"  ("role_uuid", "permission_uuid") values ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-333333333333');
      insert into "role_permission"  ("role_uuid", "permission_uuid") values ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-444444444444');
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
        '${iamConfig.MAIN_APP_IAM_MGT_ID}', CURRENT_DATE, CURRENT_DATE, 
        '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
        '${iamConfig.MAIN_APP_IAM_MGT}', '${iamConfig.MAIN_APP_IAM_MGT_NAME}', 'Description by ${iamConfig.MAIN_APP_IAM_MGT}', false);`,
    );
  }

  async down(): Promise<void> {
    this.addSql(`delete from "system"."application" where "uuid" = '22222222-2222-2222-2222-222222222222'`);
    this.addSql(`delete from "system"."application" where "uuid" = '11111111-1111-1111-1111-111111111111'`);
  }
}
