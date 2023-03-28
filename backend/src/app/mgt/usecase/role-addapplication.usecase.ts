import { Role } from '../../../model/Role';
import { Application } from '../../../model/System/Application';
import { UseCasePlugin, UseCasePluginMetadata } from '../../../commons/usecase';
import { RequestInfo } from '../../../commons/request-info';

/**
 * Padroniza a inicial da role para sempre estar em minúsculo
 */
export class RoleAddAplicationUseCase extends UseCasePlugin<Role> {
  prePersist = async (data: UseCasePluginMetadata<Role>, request: RequestInfo): Promise<void> => {
    data.entity.application = request.applicationRef as Application;
  };

  preUpdate = async (data: UseCasePluginMetadata<Role>): Promise<void> => {
    // Impedir que seja atualizada
    if (data.entity.application) {
      delete data.entity.application;
    }
  };
}
