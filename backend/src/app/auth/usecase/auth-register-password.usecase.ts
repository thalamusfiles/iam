import { Injectable, Scope } from '@nestjs/common';
import { FormExceptionError } from '../../../commons/form.exception';

@Injectable({ scope: Scope.REQUEST })
export class AuthRegisterPasswordUseCase {
  execute = async ({ password, password_confirmed }: { password: string; password_confirmed: string }): Promise<Array<FormExceptionError>> => {
    const errors = [];
    if (!password) {
      errors.push({ kind: 'password', error: 'O campo senha é obrigatório.' });
    } else {
      if (password.length < 6) {
        errors.push({ kind: 'password', error: 'A senha deve possuir no mínimo 6 caracteres.' });
      }
      if (password.length > 128) {
        errors.push({ kind: 'password', error: 'A senha deve possuir no máximo 128 caracteres.' });
      }
      if (!/[a-z]/.test(password.trim())) {
        errors.push({ kind: 'password', error: 'A senha deve possuir uma letra maiúscula' });
      }
      if (!/[A-Z]/.test(password.trim())) {
        errors.push({ kind: 'password', error: 'A senha deve possuir uma letra minuscula' });
      }
      if (!/\d/.test(password.trim())) {
        errors.push({ kind: 'password', error: 'A senha deve possuir uma número' });
      }
    }
    if (!password_confirmed || password_confirmed.trim().length === 0) {
      errors.push({ kind: 'password_confirmed', error: 'O campo confirmar senha é obrigatório' });
    } else if (password_confirmed !== password) {
      errors.push({ kind: 'password_confirmed', error: 'O campo confirmar senha é diferente da senha' });
    }
    return errors;
  };
}
