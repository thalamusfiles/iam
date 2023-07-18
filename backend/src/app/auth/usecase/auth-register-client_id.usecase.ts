import { Injectable, Scope } from '@nestjs/common';
import { FormExceptionError } from '../../../commons/form.exception';
import { RequestService } from '../service/request.service';

@Injectable({ scope: Scope.REQUEST })
export class AuthLoginClientIdUseCase {
  constructor(private readonly requestService: RequestService) {}

  execute = async ({ client_id }: any): Promise<Array<FormExceptionError>> => {
    const erros = [];
    if (client_id) {
      if (!(await this.requestService.checkApplicationClientId(client_id))) {
        const error = 'O client_id não existe.';
        erros.push({ kind: 'client_id', error: error });
      }
    }
    return erros;
  };
}
