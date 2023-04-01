import { AxiosResponse } from 'axios';
import Apis from '../apis';
import Endpoints from '../endpoints';

export type UserInfo = { name: string; logins: Array<{ type: string; username: string }> };
export type TokenInfo = { uuid?: string; applicationName?: string; scope: string; userAgent: string; createdAt: string; expiresIn: string };

interface MeDataSourceI {
  // Coleta informações do usuário logado
  me(): Promise<AxiosResponse<UserInfo>>;
}

interface TokenDataSourceI {
  // Coleta todos os logins realizados
  findAll(): Promise<AxiosResponse<TokenInfo[]>>;
  // Coleta todos os tokens ativos
  disable(uuid: string): Promise<AxiosResponse<void>>;
  // Coleta todos os tokens ativos
  active(): Promise<AxiosResponse<TokenInfo[]>>;
}

export class MeDataSource implements MeDataSourceI {
  async me(): Promise<AxiosResponse<UserInfo>> {
    return await Apis.ApiIAM.get(`${Endpoints.apiIAMMe}`);
  }
}

export class TokenDataSource implements TokenDataSourceI {
  async findAll(): Promise<AxiosResponse<TokenInfo[]>> {
    return await Apis.ApiIAM.get(`${Endpoints.apiIAMToken}`);
  }
  async disable(tokenUuid: string): Promise<AxiosResponse<void>> {
    return await Apis.ApiIAM.delete(`${Endpoints.apiIAMToken}/${tokenUuid}`, {
      params: {
        uuid: tokenUuid,
      },
    });
  }
  async active(): Promise<AxiosResponse<TokenInfo[]>> {
    return await Apis.ApiIAM.get(`${Endpoints.apiIAMTokenActive}`);
  }
}
