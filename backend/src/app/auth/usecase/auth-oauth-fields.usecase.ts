import { Injectable, Scope } from '@nestjs/common';
import { FormExceptionError } from '../../../commons/form.exception';
import { ResponseTypes } from '../types/response-type';

@Injectable({ scope: Scope.REQUEST })
export class AuthOauthFieldsUseCase {
  execute = async ({ cliente_id, response_type, scope }: any): Promise<Array<FormExceptionError>> => {
    const erros = [];
    if (!cliente_id) {
      const error = 'O cliente_id é obrigatório.';
      erros.push({ kind: 'cliente_id', error: error });
    }
    if (!response_type) {
      const error = 'O response_type é obrigatório.';
      erros.push({ kind: 'response_type', error: error });
    } else {
      const type: string[] = response_type.split(' ');
      const check = type.filter((t) => ResponseTypes.includes(t));
      if (check.length !== type.length) {
        const error = 'O response_type deve ser do tipo:' + ResponseTypes.join(' ');
        erros.push({ kind: 'response_type', error: error });
      }
    }
    if (!scope) {
      const error = 'O scope é obrigatório.';
      erros.push({ kind: 'scope', error: error });
    }
    return erros;
  };
}
