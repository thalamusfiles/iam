import { Region } from '../../../model/System/Region';
import { UseCasePlugin, UseCasePluginMetadata } from '../../../types/usecase';

/**
 * Adiciona o updatedBy na entidade
 */
export class BaseAddUpdatedByUseCase extends UseCasePlugin<Region> {
  preSave = async (data: UseCasePluginMetadata<Region>): Promise<void> => {
    data.entity.updatedBy = data.user.uuid;
  };
}
