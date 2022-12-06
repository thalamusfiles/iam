import { IconName } from '@fortawesome/fontawesome-svg-core';

export const ColorsDef = {
  // Listagem
  defaultBadgeVariant: 'info',
  // Cadastros
  personVariant: 'info',
  rolesVariant: 'success',
  permissionsVariant: 'outline-dark',
  // Sistemas
  regionVariant: 'outline-warning',
  applicationsVariant: 'outline-danger',
  // Atividades
  historyVariant: 'light',
};

export const IconsDef = {
  // Actions
  new: 'plus' as IconName,
  save: 'save' as IconName,
  goBack: 'arrow-left' as IconName,
  remove: 'times' as IconName,
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
  person: ['user', 'building'] as Array<IconName>,
  roles: 'file' as IconName,
  permissions: 'file' as IconName,
  region: 'map-marked' as IconName,
  applications: ['desktop', 'laptop'] as Array<IconName>,
  // Atividades
  tokensActive: 'mobile-alt' as IconName,
  history: 'history' as IconName,
};

//Constantes e identificadores de armazenamentos locais
const lsKey = 'iam_v001';
export const localStorageDef = {
  key: lsKey,
  userContextKey: `${lsKey}_user`, //Identificador de armazenamento do usuário
  tokenKey: `${lsKey}_token`, //Identificador de armazenamento do usuário
};

//Qauntidade de itens por página
export const defaultPageSize = 35;
