import { IconName } from '@fortawesome/fontawesome-svg-core';

export const ColorsDef = {
  // Listagem
  defaultBadgeVariant: 'info',
  // Cadastros
  userVariant: 'info',
  rolesVariant: 'success',
  permissionsVariant: 'dark',
  // Sistemas
  applicationsVariant: 'danger',
  // Atividades
  historyVariant: 'light',
};

export const IconsDef = {
  // Actions
  login: 'door-open' as IconName,
  new: 'plus' as IconName,
  save: 'save' as IconName,
  goBack: 'arrow-left' as IconName,
  remove: 'times' as IconName,
  add: 'plus' as IconName,
  edit: 'edit' as IconName,
  delete: 'trash' as IconName,
  upload: 'upload' as IconName,
  refresh: 'sync' as IconName,
  close: 'times' as IconName,
  clear: 'broom' as IconName,
  reset: 'undo' as IconName,
  filter: 'filter' as IconName,
  // Modules
  reports: 'chart-line' as IconName,
  management: 'tasks' as IconName,
  // Cadastros
  attachment: 'file' as IconName,
  user: ['user', 'building'] as Array<IconName>,
  roles: 'file' as IconName,
  permissions: 'lock-open' as IconName,
  applications: ['desktop', 'laptop'] as Array<IconName>,
  // Atividades
  tokensActive: 'mobile-alt' as IconName,
  history: 'history' as IconName,
  // Outros
  language: 'earth-americas' as IconName,
};

//Constantes e identificadores de armazenamentos locais
const lsKey = 'iam_v001';
export const localStorageDef = {
  key: lsKey,
  // User
  userContextKey: `${lsKey}_user`, //Identificador de armazenamento do usuário
  applicationContextKey: `${lsKey}_application`, //Identificador de armazenamento do usuário
  tokenKey: `${lsKey}_token`, //Identificador de armazenamento do usuário
  expiresIn: `${lsKey}_expires_in`, //Identificador de armazenamento do usuário
  // Listagens genéricas
  genericListTabs: `${lsKey}_generic_list_tabs`,
};

//Qauntidade de itens por página
export const defaultPageSize = 50;
