import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { IdTokenInfo } from '../../passaport/access-user-info';
import { OauthFieldsDto } from './oauth.dto';

/**
 * Dados necessários para registrar um novo usuário
 */
@Exclude()
export class ApplicationInfoDto {
  @Expose()
  @IsString()
  uuid: string;
}

/**
 * Dados necessários para registrar um novo usuário
 */
@Exclude()
export class ScopeInfoDto {
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
  id_token?: string;
  access_token?: string;
  scope: string;
  token_type: string;
  callbackUri: string;
  expires_in: number;
};
