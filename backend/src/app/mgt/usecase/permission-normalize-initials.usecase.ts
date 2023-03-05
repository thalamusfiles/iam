import { Permission } from '../../../model/Permission';
import { UseCasePlugin, UseCasePluginMetadata } from '../../../types/usecase';

/**
 * Padroniza a inicial da role para sempre estar em minúsculo
 */
export class PermissionNormalizeInitialsUseCase extends UseCasePlugin<Permission> {
  preSave = async (data: UseCasePluginMetadata<Permission>): Promise<void> => {
    if (data.entity.initials) {
      delete data.entity.initials;
    }
    const { on, action } = data.entity;
    if (on && action) {
      data.entity.initials = `${on}_${action}`.toLocaleLowerCase().replace(/[\ \^\"]/g, '_');
    }
  };
}
