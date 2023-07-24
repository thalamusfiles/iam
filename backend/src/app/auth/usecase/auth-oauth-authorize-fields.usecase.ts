import { Injectable, Scope } from '@nestjs/common';
import { FormExceptionError } from '../../../commons/form.exception';

@Injectable({ scope: Scope.REQUEST })
export class AuthOauthAuthorizeFieldsUseCase {
  execute = async ({ grant_type, code, code_verifier }: any): Promise<Array<FormExceptionError>> => {
    const erros = [];
    if (grant_type !== 'authorization_code') {
      erros.push({ kind: 'grant_type', error: 'O authorization_code é obrigatório e deve ser igual a "authorization_code".' });
    }
    if (!code) {
      erros.push({ kind: 'code', error: 'O code é obrigatório.' });
    }
    if (!code_verifier) {
      erros.push({ kind: 'code_verifier', error: 'O code_verifier é obrigatório.' });
    }
    return erros;
  };
}
