export type LoginInfo = {
  ip: string;
  region: string;
  regionRef: { uuid: string };
  application: string;
  applicationRef: { uuid: string };
  userAgent: string;
  scopes: Array<string>;
};
