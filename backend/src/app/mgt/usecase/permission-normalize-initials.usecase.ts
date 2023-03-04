import { Permission } from '../../../model/Permission';
import { UseCasePlugin, UseCasePluginMetadata } from '../../../types/usecase';

/**
 * Padroniza a inicial da role para sempre estar em minúsculo
 */
export class PermissionNormalizeInitialsUseCase extends UseCasePlugin<Permission> {
  preSave = async (data: UseCasePluginMetadata<Permission>): Promise<void> => {
    if (data.entity.initials) {
      data.entity.initials = data.entity.initials.toLocaleLowerCase().replace(/[\ \^\"]/g, '_');
    }
  };
}
