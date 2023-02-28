const defaultLogConfig = {
  FOLDER_PATH: 'tmp/logs',
};

const logConfig = {
  // Exibir log no console
  CONSOLE_LOG: process.env.NODE_ENV !== 'production',
  // Salvar log em arquivo
  FILE_LOG: process.env.NODE_ENV === 'production',
  // Caminho para salvar os logs de registros
  FOLDER_PATH: process.env.LOG_FOLDER_PATH || defaultLogConfig.FOLDER_PATH,
  // Tamanho máximo do arquivo
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  LEVEL: 'debug',
};

export default logConfig;
