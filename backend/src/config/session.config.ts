const defaultConfig = {
  SECRET: 'IAM_SESSION_SECRET_NTWHAWUCAT',
};

const sessionConfig = {
  SECRET: process.env.SESSION_SECRET || defaultConfig.SECRET,
  IGNORE_EXPIRATION: false,
};

export default sessionConfig;
