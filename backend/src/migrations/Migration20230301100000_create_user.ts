import { Migration } from '@mikro-orm/migrations';
import { CryptService } from '../app/auth/service/crypt.service';
import iamConfig from '../config/iam.config';
import { UserLoginType } from '../model/UserLogin';

export class Migration20230211000000_create_user extends Migration {
  async up(): Promise<void> {
    // Usuário Admin
    this.addSql(
      `insert into "user" ("uuid", "created_at", "updated_at", "name") values ('11111111-1111-1111-1111-111111111111', CURRENT_DATE, CURRENT_DATE, '${iamConfig.FIRST_USER_NAME}');`,
    );

    const cryptService = new CryptService();
    const _salt = cryptService.generateRandomString(64);
    const _password = cryptService.encrypt(iamConfig.IAM_PASS_SECRET_SALT, _salt, iamConfig.FIRST_USER_EMAIL);

    // Login do usuário Admin
    this.addSql(
      `insert into "user_login" (
        "uuid", "created_at", "updated_at", "user_uuid",
        "type", "username", "_salt", "_password")
      values (
        '11111111-1111-1111-1111-111111111111', CURRENT_DATE, CURRENT_DATE, '11111111-1111-1111-1111-111111111111',
        '${UserLoginType.LOCAL}', '${iamConfig.FIRST_USER_EMAIL}', '${_salt}','${_password}');`,
    );

    // Associa como gerente das aplicações
    this.addSql(
      `insert into "system"."application_managers" ("application_uuid", "user_uuid")
       values ('${iamConfig.MAIN_APP_IAM_ID}', (select user_uuid from user_login ul where username = '${iamConfig.FIRST_USER_EMAIL}'));`,
    );
    this.addSql(
      `insert into "system"."application_managers" ("application_uuid", "user_uuid")
       values ('${iamConfig.MAIN_APP_IAM_MGT_ID}', (select user_uuid from user_login ul where username = '${iamConfig.FIRST_USER_EMAIL}'));`,
    );
  }

  async down(): Promise<void> {
    this.addSql(`delete from "user" where "uuid" = '11111111-1111-1111-1111-111111111111'`);
  }
}
