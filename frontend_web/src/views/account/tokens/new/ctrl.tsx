import { action, makeObservable, observable } from 'mobx';
import { ErrosAsList, getFormExceptionErrosToObject } from '../../../../commons/error';
import { historyPush } from '../../../../commons/route';
import type { ErrorListRecord } from '../../../../commons/types/ErrorListRecord';
import { notify } from '../../../../components/Notification';
import { TokenDataSource } from '@piemontez/iam-consumer';
import type { TokenPermanent } from '@piemontez/iam-consumer/dist/iam';
import { createContext, useContext } from 'react';

export class TokensEditCtx {
  datasource = new TokenDataSource();

  //Conteudo da tela
  @observable content: TokenPermanent = {
    name: '',
    scope: '',
  };
  @observable erroMessages: string[] = [];
  @observable erros: ErrorListRecord = {};
  @observable loading = true;

  constructor() {
    makeObservable(this);
  }

  /**
   * Carregas o conteudo da tela
   * @param id
   */
  @action
  loadContent = async (uuid: any) => {
    this.loading = true;

    /*try {
      //Carrega o conteudo
      this.content = await this.datasource.createOrEditPermanent(this.content);
    } catch (error) {
      console.error(error);
      notify.warn('An error occurred while updating the listing.');
    }*/

    this.loading = false;
  };

  @action
  onSave = async () => {
    this.loading = true;

    try {
      const response = await this.datasource.createOrEditPermanent(this.content);

      this.content = response.data;

      notify.success('Salvo com sucesso.');
      historyPush(-1);
    } catch (err) {
      const data = (err as any).response?.data;

      [this.erroMessages, this.erros] = getFormExceptionErrosToObject(data, {
        splitByConstraints: true,
        removeEntityPrefix: true,
        ignoreKindsToMessage: ['initials', 'name', 'description'],
      }) as ErrosAsList;

      notify.warn(this.erroMessages.join(' '));
    }

    this.loading = false;
  };

  /**
   * Attribui os valoes informados à variável content
   * e dispara a o evento onAssignContent
   * @param values
   */
  @action
  assignContent = (values: any, cleanup: boolean = false) => {
    if (cleanup) {
      this.content = Object.assign({}, values);
    } else {
      this.content = Object.assign({}, this.content, values);
    }
  };

  onBack = async () => {
    historyPush(-1);
  };
}

export const TokensEditContext = createContext<TokensEditCtx>({} as TokensEditCtx);
export const TokensEditProvider = TokensEditContext.Provider;
export const useTokensEditStore = (): TokensEditCtx => useContext(TokensEditContext);
