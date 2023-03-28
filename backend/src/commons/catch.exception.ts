import { NotFoundError } from '@mikro-orm/core';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

/**
 * Filtra as exceções lançadas pelo MikroOrm,
 * quando não encontra um objeto utilizando o método findOneOrFail ou findOrFail.
 *
 * Modifica o status da chamada para 404 em vez de 500.
 */
@Catch(NotFoundError)
export class NotFoundExceptionFilter implements ExceptionFilter {
  public catch(exception: NotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    return response.status(404).json({ statusCode: 404, error: 'Not Found' });
  }
}
