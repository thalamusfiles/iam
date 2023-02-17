import { HttpException } from '@nestjs/common';

export type FormExceptionError = { kind: string; error: string };

export class FormException extends HttpException {
  errors: Array<FormExceptionError>;
  constructor(errors: Array<FormExceptionError>, message = null, status = 400) {
    super(message || errors.map((e) => e.error).join('\n'), status);

    this.errors = errors;
  }
}
