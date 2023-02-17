import { Region } from '../../../model/System/Region';
import { UseCasePlugin, UseCasePluginMetadata } from '../../../types/usecase';

/**
 * Adiciona o createdBy na entidade
 */
export class BaseAddCreatedByUseCase extends UseCasePlugin<Region> {
  prePersist = async (data: UseCasePluginMetadata<Region>): Promise<void> => {
    data.entity.createdBy = data.user.uuid;
  };
}
