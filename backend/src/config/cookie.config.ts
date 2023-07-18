const defaultConfig = {
  IAM_SESSION_SECRET: 'IAM_SESSION_SECRET_NTWHAWUCAT',
};

const cookieConfig = {
  NAME: 'iam_sso',
  PATH: '/auth',
  SECRET: process.env.IAM_SESSION_SECRET || defaultConfig.IAM_SESSION_SECRET,
  MAX_AGE: 60 * 5, //60 * 60 * 24 * 30 * 3,
};

export default cookieConfig;
