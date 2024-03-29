import { IdTokenInfo } from '../app/auth/passaport/access-user-info';
import { Request } from 'express';

export type RequestInfo = {
  //
  user: IdTokenInfo;
  applicationRef: { uuid: string };
} & Request;
