export class IdTokenInfo {
  iss: string;
  // Created at
  iat: number;
  // Expires In
  exp?: number;

  sub: string; /*user uuid*/

  name: string;
  //Aplication / ClientId
  aud: string;
}

export const isIdTokenInfo = (value: any): value is IdTokenInfo => {
  return value.sub;
};
