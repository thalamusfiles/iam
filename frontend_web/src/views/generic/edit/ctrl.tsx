import { computed, makeObservable, observable } from 'mobx';
import { CustomComponentI, findComponents, TargetForm, WMSPagePluginProps } from '../../../commons/plugin.component';
import { historyPush } from '../../../commons/route';

/**
 * Configurações para inicialização da listagem
 */
type CommonEditStoreOptions = {
  inModal?: boolean; //Se a tela esta sendo exibida dentro de um modal
};

export class CommonEditStore {
  constructor(private name: TargetForm, makeObs = true) {
    //Modifica classe pra ser observável
    if (makeObs) makeObservable(this);
  }

  //Informa quando esta sendo carregado a listagem
  @observable loading: boolean = false;

  //Componentes da tela
  components: WMSPagePluginProps[] = [];
  componentsClasses: (JSX.Element | null)[] = [];
  componentsClassesRefs: CustomComponentI[] = [];
  @observable componentLoaded = false;

  //react-router match
  match: any = {};

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
    this.componentsClassesRefs = [];
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
      .map((comp) =>
        comp.component ? <comp.component ctrl={this} ref={(ref) => this.componentsClassesRefs.push(ref as CustomComponentI)} /> : null,
      );
    this.componentLoaded = true;
  };

  setMatch = (match: any) => {
    this.match = match;
  };

  onBack = async () => {
    historyPush(-1);
  };

  @computed
  get componentsClass(): (JSX.Element | null)[] {
    return this.componentLoaded ? this.componentsClasses : [];
  }

  @computed
  get componentsLoaded(): WMSPagePluginProps[] {
    return this.componentLoaded ? this.components : [];
  }
}

const instances: any = {};
/**
 * Permite criar vários controladores únicos (singleton)
 * para gerenciar telas diferentes.
 * @param target nome único da tela/página
 * @param datasource api datasource para consulta dos dados
 */
export default function ctrlInstance(target: TargetForm, storeOverried?: typeof CommonEditStore): CommonEditStore {
  if (instances[target] === undefined) {
    if (storeOverried) instances[target] = new storeOverried(target);
    else instances[target] = new CommonEditStore(target);
  }
  return instances[target];
}
