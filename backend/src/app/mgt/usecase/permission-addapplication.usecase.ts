import { Permission } from '../../../model/Permission';
import { Application } from '../../../model/System/Application';
import { UseCasePlugin, UseCasePluginMetadata } from '../../../commons/usecase';
import { RequestInfo } from '../../../commons/request-info';

/**
 * Adiciona a aplicação vinda via header e validada via headers-check.middleware
 * Impede a edição da applicação
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
