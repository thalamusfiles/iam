import { Application } from '../../../model/System/Application';
import { UseCasePlugin, UseCasePluginMetadata } from '../../../commons/usecase';
import { FormExceptionError } from '../../../commons/form.exception';

/**
 * Padroniza a inicial da aplicação para sempre estar em minúsculo
 */
export class ApplicationFieldsValidationUseCase extends UseCasePlugin<Application> {
  preValidate = async (data: UseCasePluginMetadata<Application>): Promise<Array<FormExceptionError>> => {
    const errors = [] as FormExceptionError[];
    if (data.entity.description?.length < 10) {
      errors.push({ kind: 'description', error: 'O campo descrição deve ter no mínimo 10 caracteres.' });
    }
    return errors;
  };

  prePersist = async (data: UseCasePluginMetadata<Application>): Promise<void> => {
    data.entity.initials = data.entity.initials.toLocaleLowerCase().replace(/[\ \^\"]/g, '_');
  };
}
