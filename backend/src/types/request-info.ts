import { JwtUserInfo } from '../app/auth/jwt/jwt-user-info';
import { Request } from 'express';

export type RequestInfo = {
  //
  user: JwtUserInfo;
  regionRef: { uuid: string };
  applicationRef: { uuid: string };
} & Request;
