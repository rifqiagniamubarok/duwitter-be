import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const levelColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
};

const logLevels = {
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
};

const colorizeFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.printf(({ level, message, ...rest }) => {
    const json = JSON.stringify({ message, ...rest });
    return `${level}: ${json}`;
  })
);

export const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.Console({
      format: colorizeFormat,
    }),
    new DailyRotateFile({
      filename: 'log_of_erros/%DATE%-results.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
  ],
});

winston.addColors(levelColors);
