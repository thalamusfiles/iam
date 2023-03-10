const defaultConfig = {
  SECRET: 'IAM_SESSION_SECRET_NTWHAWUCAT',
};

const cookieConfig = {
  NAME: 'iam_sso',
  PATH: 'auth',
  SECRET: process.env.SESSION_SECRET || defaultConfig.SECRET,
  MAX_AGE: 10, //60 * 60 * 24 * 2,
};

export default cookieConfig;
