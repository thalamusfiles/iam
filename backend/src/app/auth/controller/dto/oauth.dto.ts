import { Expose } from 'class-transformer';
import { IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';
import iamConfig from '../../../../config/iam.config';

export class OauthFieldsDto {
  @Expose()
  @IsUUID()
  client_id: string;

  @Expose()
  @IsString()
  response_type: string;

  @Expose()
  @IsUrl({ require_tld: iamConfig.PRODCTION_MODE })
  redirect_uri?: string;

  @Expose()
  @IsString()
  scope: string;

  @Expose()
  @IsString()
  @IsOptional()
  state?: string;

  @Expose()
  @IsString()
  @IsOptional()
  code_challenge?: string;

  @Expose()
  @IsString()
  @IsOptional()
  code_challenge_method?: string;
}

export type OauthTokenDto = {
  id_token: string;
  access_token: string;
};
