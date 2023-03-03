import { FormExceptionError } from '../../../types/form.exception';

export class AuthRegisterMaxRegisterIpUseCase {
  static execute = async ({ ip }: { ip: string }): Promise<Array<FormExceptionError>> => {
    const erros = [];
    if (!ip) {
      const error = 'IP não identificado na requisição.';
      erros.push({ kind: 'ip', error: error });
    }
    /* TODO: Testar limite de registros por IP
    const amountRegister = 0;
    if (amountRegister >= REGISTER_MAX_PER_MINUTE) {
      const error = `Limite máximo de ${REGISTER_MAX_PER_MINUTE} registros por minuto.`;
      erros.push({ kind: 'ip', error: error });
    }
    if (amountRegister >= REGISTER_MAX_PER_HOUR) {
      const error = `Limite máximo de ${REGISTER_MAX_PER_HOUR} registros por hora.`;
      erros.push({ kind: 'ip', error: error });
    }
    if (amountRegister >= REGISTER_MAX_PER_WEEK) {
      const error = `Limite máximo de ${REGISTER_MAX_PER_WEEK} registros por semana.`;
      erros.push({ kind: 'ip', error: error });
    }
    if (amountRegister >= REGISTER_MAX_PER_MONTH) {
      const error = `Limite máximo de ${REGISTER_MAX_PER_MONTH} registros por mês.`;
      erros.push({ kind: 'ip', error: error });
    }*/
    return erros;
  };
}
