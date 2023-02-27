import { format } from 'winston';
const { combine, timestamp, label, printf, colorize } = format;

const machine_name = 'N/D';
// Número do processo do cluster. Informato pelo gerenciador de processos PM2.
const pm2Id = process.env.pm_id !== undefined ? process.env.pm_id : -1;
const serverName = `${machine_name}:${pm2Id}`;

const msgParser = printf(({ level, message, label, timestamp, context /*,...rest*/ }) => {
  return JSON.stringify({
    timestamp,
    level,
    message,
    context,
    serverName,
  });
});
const msgConsoleParser = printf(({ level, message, label, timestamp, context /*, ...rest*/ }) => {
  //timestamp = timestamp.split('T')[1];
  return `${timestamp} [${label}] ${level}: \x1b[35m${context}\x1b[0m ${message} `;
});

// Formata o log para salvar em arquivo
const loggerFormat = (prepend) => combine(label({ label: prepend }), timestamp(), msgParser);

// Formata o log para ser exeibido no console
const loggerFormatConsole = (prepend) => combine(label({ label: prepend }), timestamp(), colorize(), msgConsoleParser);

export { loggerFormat, loggerFormatConsole };
