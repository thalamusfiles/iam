import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { FormException, FormExceptionError } from './form.exception';

const formatValidationExpectionFactory = (errors: ValidationError[]) => {
  const errosFormated: Array<FormExceptionError> = errors.map((e) => ({
    kind: e.property,
    error: Object.values(e.constraints).join('. '),
    constraints: Object.keys(e.constraints),
  }));
  return new FormException(errosFormated); //
};

export class IamValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      transform: true,
      exceptionFactory: formatValidationExpectionFactory,
      ...options,
    });
  }
}
