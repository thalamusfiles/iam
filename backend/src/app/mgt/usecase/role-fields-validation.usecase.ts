import { Application } from '../../../model/System/Application';
import { UseCasePlugin, UseCasePluginMetadata } from '../../../commons/usecase';
import { FormExceptionError } from '../../../commons/form.exception';

/**
 * Padroniza a inicial do escopo/perfil para sempre estar em minúsculo
 */
export class RoleFieldsValidationUseCase extends UseCasePlugin<Application> {
  preValidate = async (data: UseCasePluginMetadata<Application>): Promise<Array<FormExceptionError>> => {
    const errors = [] as FormExceptionError[];
    if (data.entity.initials?.length < 3) {
      errors.push({ kind: 'initials', error: 'O campo iniciais deve ter no mínimo 3 caracteres.' });
    }
    if (data.entity.name?.length < 3) {
      errors.push({ kind: 'name', error: 'O campo name deve ter no mínimo 3 caracteres.' });
    }
    if (data.entity.description?.length < 10) {
      errors.push({ kind: 'description', error: 'O campo descrição deve ter no mínimo 10 caracteres.' });
    }
    return errors;
  };

  prePersist = async (data: UseCasePluginMetadata<Application>): Promise<void> => {
    data.entity.initials = data.entity.initials.toLocaleLowerCase().replace(/[\ \^\"]/g, '_');
  };
}
