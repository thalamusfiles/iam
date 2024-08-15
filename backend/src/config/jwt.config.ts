const defaultConfig = {
  SECRET: 'IAM_JWT_SECRET_YTLXQ3PRMC',
};

const jwtConfig = {
  ISS: 'iam',
  SECRET: process.env.JWT_SECRET || defaultConfig.SECRET,
  IGNORE_EXPIRATION: false,
  MAX_AGE: 60 * 60 * 24,
};

export default jwtConfig;
