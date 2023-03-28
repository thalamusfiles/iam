import { Application } from '../../../model/System/Application';
import { UseCasePlugin, UseCasePluginMetadata } from '../../../commons/usecase';

/**
 * Padroniza a inicial da região para sempre estar em minúsculo
 */
export class ApplicationNormalizeInitialsUseCase extends UseCasePlugin<Application> {
  prePersist = async (data: UseCasePluginMetadata<Application>): Promise<void> => {
    data.entity.initials = data.entity.initials.toLocaleLowerCase().replace(/[\ \^\"]/g, '_');
  };
}
