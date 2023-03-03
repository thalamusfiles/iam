import { JwtUserInfo } from '../../auth/jwt/jwt-user-info';
import { Request } from 'express';

export type RequestInfo = {
  //
  user: JwtUserInfo;
  applicationUuid: string;
} & Request;
