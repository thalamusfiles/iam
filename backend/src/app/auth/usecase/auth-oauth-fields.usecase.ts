import { Injectable, Scope } from '@nestjs/common';
import { FormExceptionError } from '../../../commons/form.exception';
import { ResponseTypes } from '../types/response-type';

@Injectable({ scope: Scope.REQUEST })
export class AuthOauthFieldsUseCase {
  execute = async ({ client_id, response_type, scope, code_challenge, code_challenge_method }: any): Promise<Array<FormExceptionError>> => {
    const erros = [];
    if (!client_id) {
      erros.push({ kind: 'client_id', error: 'O client_id é obrigatório.' });
    }
    if (!response_type) {
      erros.push({ kind: 'response_type', error: 'O response_type é obrigatório.' });
    } else {
      const type: string[] = response_type.split(' ');
      const check = type.filter((t) => ResponseTypes.includes(t));
      if (check.length !== type.length) {
        const error = 'O response_type deve ser do tipo:' + ResponseTypes.join(' ');
        erros.push({ kind: 'response_type', error: error });
      }

      if (type.includes('code') && (!code_challenge || !code_challenge_method)) {
        erros.push({ kind: 'code_challenge', error: 'O code_challenge é obrigatório' });
        erros.push({ kind: 'code_challenge_method', error: 'O code_challenge_method é obrigatório' });
      }
    }
    if (!scope) {
      erros.push({ kind: 'scope', error: 'O scope é obrigatório.' });
    }
    return erros;
  };
}
