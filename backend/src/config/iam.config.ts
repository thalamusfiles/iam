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
};

export default iamConfig;