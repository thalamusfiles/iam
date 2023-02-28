import { WinstonModule } from 'nest-winston';
import { createLogger, transports } from 'winston';
import logConfig from '../../config/log.config';
import { loggerFormat, loggerFormatConsole } from './logger-format';

/**
 * Cria o logger do Wiston
 * @returns
 */
const createWinstonLogger = (name: string) => {
  const transps = [];

  if (logConfig.CONSOLE_LOG) {
    transps.push(new transports.Console({ format: loggerFormatConsole(name) }));
  }

  if (logConfig.FILE_LOG) {
    transps.push(
      new transports.File({
        maxsize: logConfig.MAX_FILE_SIZE,
        filename: `${logConfig.FOLDER_PATH}/${name}.log`,
      }),
    );
  }

  const logger = createLogger({
    level: logConfig.LEVEL,
    format: loggerFormat(name),
    transports: transps,
  });

  return logger;
};

const createNestLogger = () => {
  return WinstonModule.createLogger({
    instance: createWinstonLogger('general'),
  });
};

export default createNestLogger;
