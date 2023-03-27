import { Injectable, Scope } from '@nestjs/common';
import { FormExceptionError } from '../../../types/form.exception';
import { RequestService } from '../service/request.service';

@Injectable({ scope: Scope.REQUEST })
export class AuthLoginClientIdUseCase {
  constructor(private readonly requestService: RequestService) {}

  execute = async ({ cliente_id }: any): Promise<Array<FormExceptionError>> => {
    const erros = [];
    if (cliente_id) {
      if (!(await this.requestService.checkApplicationClientId(cliente_id))) {
        const error = 'O cliente_id não existe.';
        erros.push({ kind: 'cliente_id', error: error });
      }
    }
    return erros;
  };
}
