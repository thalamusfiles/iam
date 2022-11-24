import { ApiAuth } from '../apis';
import { EndpointsDef } from '../endpoints';

interface AuthDataSourceI {
  //Altentica usuário no servidor via jwt
  login(username: string, password: string): Promise<{ user: any; token: string }>;
}

export class AuthDataSource implements AuthDataSourceI {
  async login(username: string, password: string): Promise<any> {
    return await ApiAuth.post(`${EndpointsDef.apiAuthLogin}`, {
      username,
      password,
    });
  }
}
