import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class AuthLoginDto {
  @Expose()
  @IsString()
  username: string;

  @Expose()
  @IsString()
  password: string;
}
