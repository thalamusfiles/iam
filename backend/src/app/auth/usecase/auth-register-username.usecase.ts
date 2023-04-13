import { Injectable, Scope } from '@nestjs/common';
import { FormExceptionError } from '../../../commons/form.exception';
import { AuthService } from '../service/auth.service';

@Injectable({ scope: Scope.REQUEST })
export class AuthRegisterUsernameUseCase {
  constructor(private readonly authService: AuthService) {}

  execute = async ({ username }: { username: string }): Promise<Array<FormExceptionError>> => {
    const erros = [];
    if (!username || username.length < 6) {
      const error = 'O usuário deve ter no mínimo 6 caracteres.';
      erros.push({ kind: 'username', error: error });
    } else if (username.length > 128) {
      const error = 'O usuário deve ter no máximo 128 caracteres.';
      erros.push({ kind: 'username', error: error });
    } else {
      const exists = await this.authService.checkLocalUsernameExists(username);
      if (exists) {
        const error = 'O usuário ja está sendo utilizado.';
        erros.push({ kind: 'username', error: error });
      }
    }
    return erros;
  };
}
