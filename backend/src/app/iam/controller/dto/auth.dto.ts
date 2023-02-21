import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

/**
 * Dados necessários para registrar um novo usuário
 */
@Exclude()
export class AuthRegisterDto {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  username: string;

  @Expose()
  @IsString()
  password: string;
}

/**
 * Dados necessários pra realizar o login
 */
@Exclude()
export class AuthLoginDto {
  @Expose()
  @IsString()
  username: string;

  @Expose()
  @IsString()
  password: string;
}
