const iamConfig = {
  PRODCTION_MODE: process.env.NODE_ENV === 'production',
  // Default Login Scope
  DEFAULT_SCOPE: 'iam_all',
  // Applicação Principal
  MAIN_APP_IAM: 'iam',
  MAIN_APP_IAM_ID: '1c7c9168-8060-40ef-a2b0-3734184a6a5c',
  // Aplicação de gestão do IAM SSO
  MAIN_APP_IAM_MGT: 'iam_mgt',
  MAIN_APP_IAM_MGT_ID: '299480c5-df62-4d41-9ca9-040dc21ee860',
};

export default iamConfig;
