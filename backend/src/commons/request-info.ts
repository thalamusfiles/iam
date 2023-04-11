import { AccessUserInfo } from '../app/auth/passaport/access-user-info';
import { Request } from 'express';

export type RequestInfo = {
  //
  user: AccessUserInfo;
  applicationRef: { uuid: string };
} & Request;
