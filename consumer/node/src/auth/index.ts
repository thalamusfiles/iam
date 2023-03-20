import { ApiAuth } from '../apis';
import { EndpointsDef } from '../endpoints';

type OauthFieldsDto = {
  cliente_id: string;
  response_type: string;
  redirect_uri: string;
  scope: string;
};

type RegisterDto = {
  name: string;
  username: string;
  password: string;
  password_confirmed: string;
};

type LoginDto = {
  username: string;
  password: string;
};

interface AuthDataSourceI {
  //Registra novo usuário no servidor e realiza login oauth
  register(register: LoginDto, oauth: OauthFieldsDto): Promise<{ user: any; token: string }>;
  //Autêntica usuário no servidor via oauth
  login(login: LoginDto, oauth: OauthFieldsDto): Promise<{ user: any; token: string }>;
}

export class AuthDataSource implements AuthDataSourceI {
  async register({ name, username, password, password_confirmed }: RegisterDto, oauth: OauthFieldsDto): Promise<any> {
    return await ApiAuth.post(`${EndpointsDef.apiAuthLogin}`, {
      name,
      username,
      password,
      password_confirmed,
      ...oauth,
    });
  }

  async login({ username, password }: LoginDto, oauth: OauthFieldsDto): Promise<any> {
    return await ApiAuth.post(`${EndpointsDef.apiAuthLogin}`, {
      username,
      password,
      ...oauth,
    });
  }
}
