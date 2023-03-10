import { Injectable, Scope } from '@nestjs/common';
import iamConfig from '../../../config/iam.config';
import { FormExceptionError } from '../../../types/form.exception';
import { RequestService } from '../service/request.service';

@Injectable({ scope: Scope.REQUEST })
export class AuthRegisterMaxRegisterIpUseCase {
  constructor(private readonly requestService: RequestService) {}

  execute = async ({ ip }: { ip: string }): Promise<Array<FormExceptionError>> => {
    const erros = [];
    if (!ip) {
      const error = 'IP não identificado na requisição.';
      erros.push({ kind: 'ip', error: error });
    } else {
      let amountRegister = await this.requestService.countLastNewRegisters(ip, 1);
      if (amountRegister > iamConfig.REGISTER_MAX_PER_MINUTE) {
        const error = `Limite máximo de ${iamConfig.REGISTER_MAX_PER_MINUTE} registros por minuto.`;
        erros.push({ kind: 'ip', error: error });
      }
      amountRegister = await this.requestService.countLastNewRegisters(ip, 60);
      if (amountRegister > iamConfig.REGISTER_MAX_PER_HOUR) {
        const error = `Limite máximo de ${iamConfig.REGISTER_MAX_PER_HOUR} registros por hora.`;
        erros.push({ kind: 'ip', error: error });
      }
      amountRegister = await this.requestService.countLastNewRegisters(ip, 60 * 24 * 7);
      if (amountRegister > iamConfig.REGISTER_MAX_PER_WEEK) {
        const error = `Limite máximo de ${iamConfig.REGISTER_MAX_PER_WEEK} registros por semana.`;
        erros.push({ kind: 'ip', error: error });
      }
      amountRegister = await this.requestService.countLastNewRegisters(ip, 60 * 24 * 30);
      if (amountRegister > iamConfig.REGISTER_MAX_PER_MONTH) {
        const error = `Limite máximo de ${iamConfig.REGISTER_MAX_PER_MONTH} registros por mês.`;
        erros.push({ kind: 'ip', error: error });
      }
    }

    return erros;
  };
}
