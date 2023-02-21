import { Region } from '../../../model/System/Region';
import { UseCasePlugin, UseCasePluginMetadata } from '../../../types/usecase';

/**
 * Padroniza a inicial da região para sempre estar em minúsculo
 */
export class RegionNormalizeInitialsUseCase extends UseCasePlugin<Region> {
  prePersist = async (data: UseCasePluginMetadata<Region>): Promise<void> => {
    data.entity.initials = data.entity.initials.toLocaleLowerCase().replace(/[\ \^\"]/g, '_');
  };
}
