const defaultIamConfig = {
  IAM_PASS_SECRET_SALT: 'IAM_PASS_SECRET_SALT_2VTga2Vr4m',
};

const iamConfig = {
  PRODCTION_MODE: process.env.NODE_ENV === 'production',
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

  // Região Principal
  MAIN_REGION: 'global',
  // Aplicação de authenticação SSO
  MAIN_APP_IAM: 'iam',
  MAIN_APP_IAM_ID: '11111111-1111-1111-1111-111111111111',
  MAIN_APP_IAM_NAME: 'Conta Thalamus',
  // Aplicação de gestão do IAM SSO
  MAIN_APP_IAM_MGT: 'iam_mgt',
  MAIN_APP_IAM_MGT_ID: '22222222-2222-2222-2222-222222222222',
  MAIN_APP_IAM_MGT_NAME: 'Gestão IAM Thalamus',
  // Primeiro Usuário
  FIRST_USER_NAME: 'First User',
  // Após instalação, cadastrar um segundo usuário e remover o primeiro.
  FIRST_USER_EMAIL: 'first@thalamus.digital',
};

export default iamConfig;
