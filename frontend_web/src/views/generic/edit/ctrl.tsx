import { computed, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import { findComponents, PagePluginProps, TargetForm } from '../../../commons/plugin.component';
import { historyPush } from '../../../commons/route';

/**
 * Configurações para inicialização da listagem
 */
type CommonEditStoreOptions = {
  inModal?: boolean; //Se a tela esta sendo exibida dentro de um modal
};

export class CommonEditCtx {
  constructor(private name: TargetForm, makeObs = true) {
    //Modifica classe pra ser observável
    if (makeObs) makeObservable(this);
  }

  //Informa quando esta sendo carregado a listagem
  @observable loading: boolean = false;

  //Componentes da tela
  components: PagePluginProps[] = [];
  componentsClasses: (JSX.Element | null)[] = [];
  @observable componentLoaded = false;

  options: CommonEditStoreOptions = {
    inModal: false,
  };

  //callbacks
  afterBuild?: () => Promise<void>;
  onSave?: () => Promise<void>;

  build = async (options?: CommonEditStoreOptions) => {
    if (options) {
      Object.assign(this.options, options);
    }

    await this.clear();
    await this.loadComponents();
    if (this.afterBuild) {
      await this.afterBuild();
    }
  };

  /**
   * Utilizado quando o componente é destruido
   * Finaliza as conexções em execução
   */
  close = async () => {
    await this.clear();
  };

  clear = () => {
    this.components = [];
    this.componentsClasses = [];
    this.componentLoaded = false;
  };

  /**
   * Carrega os componentes vinculados à tela
   */
  loadComponents = async () => {
    this.components = findComponents(this.name);
    this.componentsClasses = this.components
      .filter((comp) => comp.component)
      .filter((comp) => !this.options.inModal || comp.displayInModal)
      .sort((l, r) => (l.order === r.order ? 0 : l.order < r.order ? -1 : 1))
      .map((comp, idx) => {
        if (comp.component) {
          return <comp.component key={idx} />;
        }
        return null;
      });
    this.componentLoaded = true;
  };

  onBack = async () => {
    historyPush(-1);
  };

  @computed
  get componentsClass(): (JSX.Element | null)[] {
    return this.componentLoaded ? this.componentsClasses : [];
  }

  @computed
  get componentsLoaded(): PagePluginProps[] {
    return this.componentLoaded ? this.components : [];
  }
}

export const CommonEditContext = createContext<CommonEditCtx>({} as CommonEditCtx);
export const CommonEditContextProvider = CommonEditContext.Provider;
export const useCommonEditStore = <Ctx extends CommonEditCtx>(): Ctx => useContext(CommonEditContext) as Ctx;
