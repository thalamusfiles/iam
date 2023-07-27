import { AxiosResponse } from 'axios';
import Apis from '../apis';
import Endpoints from '../endpoints';

export type OauthFieldsDto = {
  client_id: string;
  response_type: string;
  redirect_uri?: string;
  scope: string;
  state?: string;
  code_challenge?: string;
  code_challenge_method?: string;
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

export type AuthLoginRespDto = {
  id_token: string;
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  callback_uri: string;
};
export type ApplicationInfo = { uuid: string; name: string };
export type ScopeInfo = { scope: string; app: { name: string; description: string }; permission: { description: string } };

interface AuthDataSourceI {
  // Registra novo usuário no servidor e realiza login oauth
  register(register: LoginDto, oauth: OauthFieldsDto): Promise<AxiosResponse<AuthLoginRespDto>>;
  // Autêntica usuário no servidor via oauth
  login(login: LoginDto, oauth: OauthFieldsDto): Promise<AxiosResponse<AuthLoginRespDto>>;
  // Coleta o token de acesso da sessão
  token(): Promise<AxiosResponse<Partial<AuthLoginRespDto>>>;
  // Desloga da sessão e access token
  logout(): Promise<AxiosResponse<void>>;
}

interface OauthDataSourceI {
  // Coleta informações da aplicação
  applicationInfo(applicationUuid: string): Promise<AxiosResponse<ApplicationInfo>>;
  // Coleta informações dos escopos solicitados
  scopeInfo(scope: string): Promise<AxiosResponse<ScopeInfo[]>>;
}

export class AuthDataSource implements AuthDataSourceI {
  async register({ name, username, password, password_confirmed }: RegisterDto, oauth: OauthFieldsDto): Promise<AxiosResponse<AuthLoginRespDto>> {
    return await Apis.ApiAuth.post(`${Endpoints.apiAuthRegister}`, {
      name,
      username,
      password,
      password_confirmed,
      ...oauth,
    });
  }

  async login({ username, password }: LoginDto, oauth: OauthFieldsDto): Promise<AxiosResponse<AuthLoginRespDto>> {
    return await Apis.ApiAuth.post(`${Endpoints.apiAuthLogin}`, {
      username,
      password,
      ...oauth,
    });
  }

  async token(): Promise<AxiosResponse<Partial<AuthLoginRespDto>>> {
    return await Apis.ApiAuth.get(`${Endpoints.apiAuthToken}`);
  }

  async logout(): Promise<AxiosResponse<void>> {
    return await Apis.ApiAuth.get(`${Endpoints.apiAuthLogout}`);
  }
}

export class OauthDataSource implements OauthDataSourceI {
  async applicationInfo(applicationUuid: string): Promise<AxiosResponse<ApplicationInfo>> {
    return await Apis.ApiAuth.get(`${Endpoints.apiOauthApplicationInfo}`, {
      params: {
        uuid: applicationUuid,
      },
    });
  }
  async scopeInfo(scope: string): Promise<AxiosResponse<ScopeInfo[]>> {
    return await Apis.ApiAuth.get(`${Endpoints.apiOauthScopeInfo}`, {
      params: {
        scope,
      },
    });
  }
}
