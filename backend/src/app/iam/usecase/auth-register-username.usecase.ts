import { FormExceptionError } from '../../../types/form.exception';

export class AuthRegisterUsernameUseCase {
  static execute = async ({ username }: { username: string }): Promise<Array<FormExceptionError>> => {
    const erros = [];
    if (!username || username.length < 6) {
      const error = 'O usuário deve ter no mínimo 6 caracteres.';
      erros.push({ kind: 'password', error: error });
    } else if (username.length > 128) {
      const error = 'O usuário deve ter no máximo 128 caracteres.';
      erros.push({ kind: 'password', error: error });
    }
    return erros;
  };
}
