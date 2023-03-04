import { Role } from '../../../model/Role';
import { UseCasePlugin, UseCasePluginMetadata } from '../../../types/usecase';

/**
 * Padroniza a inicial da role para sempre estar em minúsculo
 */
export class RoleNormalizeInitialsUseCase extends UseCasePlugin<Role> {
  preSave = async (data: UseCasePluginMetadata<Role>): Promise<void> => {
    if (data.entity.initials) {
      data.entity.initials = data.entity.initials.toLocaleLowerCase().replace(/[\ \^\"]/g, '_');
    }
  };
}
