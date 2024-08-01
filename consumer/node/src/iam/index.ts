import { AxiosResponse } from 'axios';
import Apis from '../apis';
import Endpoints from '../endpoints';

export type UserInfo = { name: string; logins: Array<{ type: string; username: string }> };
export type TokenInfo = { uuid?: string; applicationName?: string; scope: string; userAgent: string; createdAt: string; expiresIn: string };
export type TokenPermanent = { uuid?: string; name: string; scope: string; accessToken?: string };

interface MeDataSourceI {
  // Coleta informações do usuário logado
  me(): Promise<AxiosResponse<UserInfo>>;
}

interface TokenDataSourceI {
  // Coleta todos os logins realizados
  findAll(): Promise<AxiosResponse<TokenInfo[]>>;
  // Coleta todos os tokens ativos
  active(): Promise<AxiosResponse<TokenInfo[]>>;
  // Coleta todos os tokens ativos
  disable(uuid: string): Promise<AxiosResponse<void>>;
  // Cria um token permanente
  createOrEditPermanent(token: TokenPermanent): Promise<AxiosResponse<TokenPermanent>>;
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
  async active(): Promise<AxiosResponse<TokenInfo[]>> {
    return await Apis.ApiIAM.get(`${Endpoints.apiIAMTokenActive}`);
  }
  async createOrEditPermanent(token: TokenPermanent): Promise<AxiosResponse<TokenPermanent>> {
    return await Apis.ApiIAM.post(`${Endpoints.apiIAMToken}`, token);
  }
  async disable(tokenUuid: string): Promise<AxiosResponse<void>> {
    return await Apis.ApiIAM.delete(`${Endpoints.apiIAMToken}/${tokenUuid}`, {
      params: {
        uuid: tokenUuid,
      },
    });
  }
}
