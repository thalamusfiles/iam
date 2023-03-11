import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString, IsUrl, IsUUID } from 'class-validator';
import iamConfig from '../../../../config/iam.config';
import { AccessUserInfo } from '../../passaport/access-user-info';

class OauthFieldsDto {
  @Expose()
  @IsUUID()
  cliente_id: string;

  @Expose()
  @IsString()
  response_type: string;

  @Expose()
  @IsUrl({ require_tld: iamConfig.PRODCTION_MODE })
  redirect_uri: string;

  @Expose()
  @IsString()
  scope: string;
}

/**
 * Dados necessários para registrar um novo usuário
 */
@Exclude()
export class AuthRegisterDto extends OauthFieldsDto {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  username: string;

  @Expose()
  @IsString()
  password: string;

  @Expose()
  @IsString()
  password_confirmed: string;
}

/**
 * Dados necessários pra realizar o login
 */
@Exclude()
export class AuthLoginDto extends OauthFieldsDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  username: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export type AuthLoginRespDto = {
  token_type: string;
  access_token?: string;
  scope: string;
  expires_in: number;
  info?: AccessUserInfo;
};
