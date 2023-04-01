import { AxiosResponse } from 'axios';
import Apis from '../apis';
import Endpoints from '../endpoints';

export type OauthFieldsDto = {
  cliente_id: string;
  response_type: string;
  redirect_uri?: string;
  scope: string;
};

export type RegisterDto = {
  name: string;
  username: string;
  password: string;
  password_confirmed: string;
};

export type LoginDto = {
  username: string;
  password: string;
};

export type ApplicationInfo = { uuid: string; name: string };
export type ScopeInfo = { scope: string; app: { name: string; description: string }; permission: { description: string } };

interface AuthDataSourceI {
  // Registra novo usuário no servidor e realiza login oauth
  register(register: LoginDto, oauth: OauthFieldsDto): Promise<AxiosResponse<{ user: any; token: string }>>;
  // Autêntica usuário no servidor via oauth
  login(login: LoginDto, oauth: OauthFieldsDto): Promise<AxiosResponse<{ user: any; token: string }>>;
}

interface OauthDataSourceI {
  // Coleta informações da aplicação
  applicationInfo(applicationUuid: string): Promise<AxiosResponse<ApplicationInfo>>;
  // Coleta informações dos escopos solicitados
  scopeInfo(scope: string): Promise<AxiosResponse<ScopeInfo[]>>;
}

export class AuthDataSource implements AuthDataSourceI {
  async register({ name, username, password, password_confirmed }: RegisterDto, oauth: OauthFieldsDto): Promise<any> {
    return await Apis.ApiAuth.post(`${Endpoints.apiAuthRegister}`, {
      name,
      username,
      password,
      password_confirmed,
      ...oauth,
    });
  }

  async login({ username, password }: LoginDto, oauth: OauthFieldsDto): Promise<any> {
    return await Apis.ApiAuth.post(`${Endpoints.apiAuthLogin}`, {
      username,
      password,
      ...oauth,
    });
  }
}

export class OauthDataSource implements OauthDataSourceI {
  async applicationInfo(applicationUuid: string): Promise<any> {
    return await Apis.ApiAuth.get(`${Endpoints.apiOauthApplicationInfo}`, {
      params: {
        uuid: applicationUuid,
      },
    });
  }
  async scopeInfo(scope: string): Promise<any> {
    return await Apis.ApiAuth.get(`${Endpoints.apiOauthScopeInfo}`, {
      params: {
        scope,
      },
    });
  }
}
