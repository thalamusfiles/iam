const defaultConfig = {
  SECRET: 'IAM_SESSION_SECRET_NTWHAWUCAT',
};

const cookieConfig = {
  NAME: 'iam_sso',
  PATH: 'auth',
  SECRET: process.env.SESSION_SECRET || defaultConfig.SECRET,
  MAX_AGE: 60, //60 * 60 * 24 * 30 * 3,
};

export default cookieConfig;
