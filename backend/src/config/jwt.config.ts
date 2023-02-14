const defaultConfig = {
  SECRET: 'IAM_JWT_SECRET_YTLXQ3PRMC',
};

const jwtConfig = {
  SECRET: process.env.JWT_SECRET || defaultConfig.SECRET,
  IGNORE_EXPIRATION: false,
};

export default jwtConfig;
