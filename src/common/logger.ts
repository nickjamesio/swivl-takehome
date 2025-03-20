import { format, createLogger, transports } from 'winston';

export const LogLevel = {
  error: 'error',
  warn: 'warn',
  info: 'info',
  http: 'http',
  verbose: 'verbose',
  debug: 'debug',
  silly: 'silly',
} as const;

const consoleTransport = new transports.Console({
  format: format.prettyPrint({ colorize: true }),
});

export const logger = createLogger({
  level: LogLevel.info,
  transports: [consoleTransport],
});
