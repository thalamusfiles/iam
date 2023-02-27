import { Injectable, Logger } from '@nestjs/common';
import { FormException } from '../../../types/form.exception';
import { UseCaseMethod, UseCasePlugin, UseCasePluginMetadata } from '../../../types/usecase';
import { EntityProps } from '../types/crud.controller';

type Class<T> = new (...args: any[]) => T;

@Injectable()
export class UseCaseMGTService {
  private readonly logger = new Logger(UseCaseMGTService.name);

  private useCases: { [key: string]: Array<Class<UseCasePlugin>> } = {};

  constructor() {
    this.logger.log('initialized');
  }

  register(modelClass: Class<any>, useCase: Class<UseCasePlugin>): void {
    this.logger.log(`Registering ${useCase.name} use case On ${modelClass.name}`);

    const className = modelClass.name;
    if (!this.useCases[className]) {
      this.useCases[className] = [];
    }
    this.useCases[className].push(useCase);
  }

  async execute(modelClass: Class<any>, method: UseCaseMethod, props: EntityProps<any>): Promise<void> {
    const className = modelClass.name;
    const useCases = this.useCases[className];
    if (useCases) {
      const metadata: UseCasePluginMetadata = { ...props, name: className };

      switch (method) {
        case UseCaseMethod.preValidate:
          let allErros = [];
          for (const useCase of useCases) {
            const erros = await new useCase().preValidate(metadata);
            if (erros) allErros = allErros.concat(erros);
          }
          if (allErros.length) {
            throw new FormException(allErros);
          }
          break;
        case UseCaseMethod.prePersist:
          for (const useCase of useCases) new useCase().prePersist(metadata);
          break;
        case UseCaseMethod.postPersist:
          for (const useCase of useCases) new useCase().postPersist(metadata);
          break;
        case UseCaseMethod.preUpdate:
          for (const useCase of useCases) new useCase().preUpdate(metadata);
          break;
        case UseCaseMethod.postUpdate:
          for (const useCase of useCases) new useCase().postUpdate(metadata);
          break;
        case UseCaseMethod.preSave:
          for (const useCase of useCases) new useCase().preSave(metadata);
          break;
        case UseCaseMethod.postSave:
          for (const useCase of useCases) new useCase().postSave(metadata);
          break;
        case UseCaseMethod.preRemove:
          for (const useCase of useCases) new useCase().preRemove(metadata);
          break;
        case UseCaseMethod.postRemove:
          for (const useCase of useCases) new useCase().postRemove(metadata);
          break;
      }
    }
  }

  preValidate(modelClass: Class<any>, props: EntityProps<any>): Promise<void> {
    return this.execute(modelClass, UseCaseMethod.preValidate, props);
  }
  prePersist(modelClass: Class<any>, props: EntityProps<any>): Promise<void> {
    return this.execute(modelClass, UseCaseMethod.prePersist, props);
  }
  postPersist(modelClass: Class<any>, props: EntityProps<any>): Promise<void> {
    return this.execute(modelClass, UseCaseMethod.postPersist, props);
  }
  preUpdate(modelClass: Class<any>, props: EntityProps<any>): Promise<void> {
    return this.execute(modelClass, UseCaseMethod.preUpdate, props);
  }
  postUpdate(modelClass: Class<any>, props: EntityProps<any>): Promise<void> {
    return this.execute(modelClass, UseCaseMethod.postUpdate, props);
  }
  preSave(modelClass: Class<any>, props: EntityProps<any>): Promise<void> {
    return this.execute(modelClass, UseCaseMethod.preSave, props);
  }
  postSave(modelClass: Class<any>, props: EntityProps<any>): Promise<void> {
    return this.execute(modelClass, UseCaseMethod.postSave, props);
  }
  preRemove(modelClass: Class<any>, props: EntityProps<any>): Promise<void> {
    return this.execute(modelClass, UseCaseMethod.preRemove, props);
  }
  postRemove(modelClass: Class<any>, props: EntityProps<any>): Promise<void> {
    return this.execute(modelClass, UseCaseMethod.postRemove, props);
  }
}
