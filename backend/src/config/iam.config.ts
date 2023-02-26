const defaultIamConfig = {
  IAM_PASS_SECRET_SALT: 'IAM_PASS_SECRET_SALT_2VTga2Vr4m',
};

const iamConfig = {
  // Região Principal
  MAIN_REGION: 'global',
  // Aplicação de authenticação SSO
  MAIN_APP_IAM: 'iam',
  // Aplicação de gestão do IAM SSO
  MAIN_APP_IAM_MGT: 'iam_mgt',
  // Salt adicional na gerão do password
  IAM_PASS_SECRET_SALT: process.env.DATABASE_HOST || defaultIamConfig.IAM_PASS_SECRET_SALT,
  // Máximo de tentativa de registros por IP
  REGISTER_RATE_LIMITE: 3,
  // Tempo que registra
  REGISTER_RATE_LIMITE_REST_TIME: 60,
};

export default iamConfig;
