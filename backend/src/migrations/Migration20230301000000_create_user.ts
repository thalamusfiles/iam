import { Migration } from '@mikro-orm/migrations';
import { CryptService } from '../app/auth/service/crypt.service';
import iamConfig from '../config/iam.config';
import { UserLoginType } from '../model/UserLogin';
import appsConfig from '../config/apps.config';

export class Migration20230211000000_create_user extends Migration {
  async up(): Promise<void> {
    // Usuário Admin
    this.addSql(
      `insert into "user" ("uuid", "created_at", "updated_at", "name") values ('${appsConfig.FIRST_ID}', CURRENT_DATE, CURRENT_DATE, '${iamConfig.FIRST_USER_NAME}');`,
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
        '${appsConfig.FIRST_ID}', CURRENT_DATE, CURRENT_DATE, '${appsConfig.FIRST_ID}',
        '${UserLoginType.LOCAL}', '${iamConfig.FIRST_USER_EMAIL}', '${_salt}','${_password}');`,
    );
  }

  async down(): Promise<void> {
    this.addSql(`delete from "user" where "uuid" = '${appsConfig.FIRST_ID}'`);
  }
}
