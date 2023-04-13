const iamConfig = {
  PRODCTION_MODE: process.env.NODE_ENV === 'production',
  // Default Login Scope
  DEFAULT_SCOPE: 'iam_all',
  // Applicação Principal
  MAIN_APP_IAM: 'iam',
  MAIN_APP_IAM_ID: '11111111-1111-1111-1111-111111111111',
  // Aplicação de gestão do IAM SSO
  MAIN_APP_IAM_MGT: 'iam_mgt',
  MAIN_APP_IAM_MGT_ID: '22222222-2222-2222-2222-222222222222',
};

export default iamConfig;
