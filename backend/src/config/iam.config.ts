const port = parseInt(process.env.SYSTEM_PORT) || 3000;

const defaultIamConfig = {
  IAM_PASS_SECRET_SALT: 'IAM_PASS_SECRET_SALT_2VTga2Vr4m',
};

const iamConfig = {
  PRODCTION_MODE: process.env.NODE_ENV === 'production',
  HOST: process.env.HOST || `http://iam_backend:${port}`,
  PORT: port,
  STATIC_FILE_MAX_AGE: 2 * 24 * 60 * 60 * 1000,
  // Dev configs
  DEV_URL: `http://localhost:${port + 1000}`,

  // Salt adicional na gerão do password
  IAM_PASS_SECRET_SALT: process.env.IAM_PASS_SECRET_SALT || defaultIamConfig.IAM_PASS_SECRET_SALT,

  // Máximo de tentativa de registros por IP
  REGISTER_RATE_LIMITE: 10,
  // Tempo que registra
  REGISTER_RATE_LIMITE_RESET_TIME: 60,
  // Máximo de registros por minuto
  REGISTER_MAX_PER_MINUTE: 2,
  // Máximo de registros por hora
  REGISTER_MAX_PER_HOUR: 5,
  // Máximo de registros por semana
  REGISTER_MAX_PER_WEEK: 20,
  // Máximo de registros por mês
  REGISTER_MAX_PER_MONTH: 30,

  // Scopo principal
  MAIN_SCOPE_IAM: 'iam_all',
  // Perfil base Iam e suas permissões
  MAIN_ROLE_IAM: 'all',
  // Permissões base do sistema
  MAIN_PERMISSION_ME_VIEW_IAM: 'me_view',
  MAIN_PERMISSION_LOGIN_VIEW_IAM: 'login_view',
  MAIN_PERMISSION_TOKEN_VIEW_IAM: 'token_view',
  MAIN_PERMISSION_TOKEN_REMOVE_IAM: 'token_remove',
  // Primeiro Usuário
  FIRST_USER_NAME: 'First User',
  // Após instalação, cadastrar um segundo usuário e remover o primeiro.
  FIRST_USER_EMAIL: 'first@first.first',
};

export default iamConfig;
