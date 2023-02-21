import { FormExceptionError } from '../../../types/form.exception';

export class AuthRegisterPasswordUseCase {
  static execute = async ({ password }: { password: string }): Promise<Array<FormExceptionError>> => {
    const erros = [];
    if (!password || password.length < 6) {
      const error = 'A senha deve ter no mínimo 6 caracteres.';
      erros.push({ kind: 'password', error: error });
    } else if (password.length > 128) {
      const error = 'A senha deve ter no máximo 128 caracteres.';
      erros.push({ kind: 'password', error: error });
    }
    return erros;
  };
}
