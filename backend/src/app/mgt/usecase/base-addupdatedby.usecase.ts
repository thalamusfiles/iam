import { UseCasePlugin, UseCasePluginMetadata } from '../../../commons/usecase';
import { IamBaseEntityWithUser } from '../../../model/Base/IamBaseEntityWithUser';

/**
 * Adiciona o updatedBy na entidade
 */
export class BaseAddUpdatedByUseCase extends UseCasePlugin<IamBaseEntityWithUser> {
  preSave = async (data: UseCasePluginMetadata<IamBaseEntityWithUser>): Promise<void> => {
    data.entity.updatedBy = data.user.sub;
  };
}
