import { UseCasePlugin, UseCasePluginMetadata } from '../../../commons/usecase';
import { IamBaseEntityWithUser } from '../../../model/Base/IamBaseEntityWithUser';

/**
 * Adiciona o createdBy na entidade
 */
export class BaseAddCreatedByUseCase extends UseCasePlugin<IamBaseEntityWithUser> {
  prePersist = async (data: UseCasePluginMetadata<IamBaseEntityWithUser>): Promise<void> => {
    data.entity.createdBy = data.user.sub;
  };
}
