import { Exclude, Expose } from "class-transformer";
import { IsString, IsUUID } from "class-validator";

@Exclude()
export class TokenInfo {
  @Expose()
  uuid?: string;

  @Expose()
  applicationName?: string;

  @Expose()
  scope: string;

  @Expose()
  userAgent: string;

  @Expose()
  createdAt: Date;

  @Expose()
  expiresIn: Date;
};

export class TokenPermanentDto {
  @Expose()
  @IsUUID()
  uuid?: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  scope: string;

  @Expose()
  @IsString()
  accessToken?: string;
};
