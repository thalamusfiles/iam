export class IdTokenInfo {
  iss: 'iam';
  // Created at
  iat: number;
  // Expires In
  exp?: number;

  sub: string; /*sub*/

  name: string;
  //Aplication / ClientId
  aud: string;
}
