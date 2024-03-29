import { Injectable, Scope } from '@nestjs/common';
import { FormExceptionError } from '../../../commons/form.exception';

@Injectable({ scope: Scope.REQUEST })
export class AuthRegisterNameUseCase {
  execute = async ({ name }: { name: string }): Promise<Array<FormExceptionError>> => {
    const erros = [];
    if (!name || name.length < 6) {
      const error = 'O nome deve ter no mínimo 6 caracteres.';
      erros.push({ kind: 'name', error: error });
    } else if (name.length > 255) {
      const error = 'O nome deve ter no máximo 255 caracteres.';
      erros.push({ kind: 'name', error: error });
    }
    return erros;
  };
}
