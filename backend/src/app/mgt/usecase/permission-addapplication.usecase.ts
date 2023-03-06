import { Permission } from '../../../model/Permission';
import { Application } from '../../../model/System/Application';
import { UseCasePlugin, UseCasePluginMetadata } from '../../../types/usecase';
import { RequestInfo } from '../../../types/request-info';

/**
 * Padroniza a inicial da role para sempre estar em minúsculo
 */
export class PermissionAddAplicationUseCase extends UseCasePlugin<Permission> {
  prePersist = async (data: UseCasePluginMetadata<Permission>, request: RequestInfo): Promise<void> => {
    data.entity.application = request.applicationRef as Application;
  };

  preUpdate = async (data: UseCasePluginMetadata<Permission>): Promise<void> => {
    // Impedir que seja atualizada
    if (data.entity.application) {
      delete data.entity.application;
    }
  };
}
