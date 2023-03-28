import { Injectable, Logger } from '@nestjs/common';
import { FormException } from '../../../commons/form.exception';
import { UseCaseMethod, UseCasePlugin, UseCasePluginMetadata } from '../../../commons/usecase';
import { EntityProps } from '../types/crud.controller';
import { RequestInfo } from '../../../commons/request-info';

type Class<T> = new (...args: any[]) => T;

/**
 * Processa os casos de uso vinculádos aos modelos de banco
 */
@Injectable()
export class UseCaseMGTService {
  private readonly logger = new Logger(UseCaseMGTService.name);

  private useCases: { [key: string]: Array<Class<UseCasePlugin>> } = {};

  constructor() {
    this.logger.log('starting');
  }

  register(modelClass: Class<any>, useCase: Class<UseCasePlugin>): void {
    this.logger.log(`Registering ${useCase.name} use case On ${modelClass.name}`);

    const className = modelClass.name;
    if (!this.useCases[className]) {
      this.useCases[className] = [];
    }
    this.useCases[className].push(useCase);
  }

  async execute(modelClass: Class<any>, method: UseCaseMethod, props: EntityProps<any>, request: RequestInfo): Promise<void> {
    const className = modelClass.name;
    const useCases = this.useCases[className];
    if (useCases) {
      const metadata: UseCasePluginMetadata = { ...props, name: className };

      switch (method) {
        case UseCaseMethod.preValidate:
          let allErros = [];
          for (const useCase of useCases) {
            const erros = await new useCase().preValidate(metadata, request);
            if (erros) allErros = allErros.concat(erros);
          }
          if (allErros.length) {
            throw new FormException(allErros);
          }
          break;
        case UseCaseMethod.prePersist:
          for (const useCase of useCases) new useCase().prePersist(metadata, request);
          break;
        case UseCaseMethod.postPersist:
          for (const useCase of useCases) new useCase().postPersist(metadata, request);
          break;
        case UseCaseMethod.preUpdate:
          for (const useCase of useCases) new useCase().preUpdate(metadata, request);
          break;
        case UseCaseMethod.postUpdate:
          for (const useCase of useCases) new useCase().postUpdate(metadata, request);
          break;
        case UseCaseMethod.preSave:
          for (const useCase of useCases) new useCase().preSave(metadata, request);
          break;
        case UseCaseMethod.postSave:
          for (const useCase of useCases) new useCase().postSave(metadata, request);
          break;
        case UseCaseMethod.preRemove:
          for (const useCase of useCases) new useCase().preRemove(metadata, request);
          break;
        case UseCaseMethod.postRemove:
          for (const useCase of useCases) new useCase().postRemove(metadata, request);
          break;
      }
    }
  }

  preValidate(modelClass: Class<any>, props: EntityProps<any>, request: RequestInfo): Promise<void> {
    return this.execute(modelClass, UseCaseMethod.preValidate, props, request);
  }
  prePersist(modelClass: Class<any>, props: EntityProps<any>, request: RequestInfo): Promise<void> {
    return this.execute(modelClass, UseCaseMethod.prePersist, props, request);
  }
  postPersist(modelClass: Class<any>, props: EntityProps<any>, request: RequestInfo): Promise<void> {
    return this.execute(modelClass, UseCaseMethod.postPersist, props, request);
  }
  preUpdate(modelClass: Class<any>, props: EntityProps<any>, request: RequestInfo): Promise<void> {
    return this.execute(modelClass, UseCaseMethod.preUpdate, props, request);
  }
  postUpdate(modelClass: Class<any>, props: EntityProps<any>, request: RequestInfo): Promise<void> {
    return this.execute(modelClass, UseCaseMethod.postUpdate, props, request);
  }
  preSave(modelClass: Class<any>, props: EntityProps<any>, request: RequestInfo): Promise<void> {
    return this.execute(modelClass, UseCaseMethod.preSave, props, request);
  }
  postSave(modelClass: Class<any>, props: EntityProps<any>, request: RequestInfo): Promise<void> {
    return this.execute(modelClass, UseCaseMethod.postSave, props, request);
  }
  preRemove(modelClass: Class<any>, props: EntityProps<any>, request: RequestInfo): Promise<void> {
    return this.execute(modelClass, UseCaseMethod.preRemove, props, request);
  }
  postRemove(modelClass: Class<any>, props: EntityProps<any>, request: RequestInfo): Promise<void> {
    return this.execute(modelClass, UseCaseMethod.postRemove, props, request);
  }
}
