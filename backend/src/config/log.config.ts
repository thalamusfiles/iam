const defaultLogConfig = {
  FOLDER_PATH: 'tmp/logs',
};

const logConfig = {
  // Caminho para salvar os logs de registros
  FOLDER_PATH: process.env.FOLDER_PATH || defaultLogConfig.FOLDER_PATH,
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  LEVEL: 'debug',
};

export default logConfig;
