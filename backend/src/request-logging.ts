import { Logger, INestApplication } from '@nestjs/common';
import * as morgan from 'morgan';
import * as chalk from 'chalk';

function getLogLevelColor(level: string): string {
  switch (level.trim()) {
    case 'LOG':
      return chalk.blue(level);
    case 'DEBUG':
      return chalk.cyan(level);
    case 'VERBOSE':
      return chalk.magenta(level);
    case 'WARN':
      return chalk.yellow(level);
    case 'ERROR':
      return chalk.red(level);
    default:
      return chalk.white(level);
  }
}

function formatLogMessage(message: string): string {
  const timestamp = new Date().toLocaleString();
  const pidMatch = message.match(/\[Nest\] (\d+)/);
  const pid = pidMatch ? pidMatch[1] : '';

  // Extract and color the log level
  const levelMatch = message.match(/\s+(LOG|DEBUG|VERBOSE|WARN|ERROR)\s+/);
  const level = levelMatch ? getLogLevelColor(levelMatch[1]) : '';

  // Color different components
  const moduleMatch = message.match(/\[([\w\s]+)\]/g);
  const modules = moduleMatch ? moduleMatch.map((m) => chalk.yellow(m)).join(' ') : '';

  // Format the message content
  let content = message.split(']').pop() || '';
  if (content.includes('Mapped')) {
    content = content.replace(/{([^}]+)}/, (_, route) => chalk.green(`{${route}}`));
    content = content.replace(/(GET|POST|PUT|PATCH|DELETE)/, (method) => chalk.cyan(method));
  }

  return `[Nest] ${chalk.gray(pid)} - ${chalk.gray(timestamp)} ${level} ${modules}${chalk.white(content)}`;
}

export function useRequestLogging(app: INestApplication): void {
  const logger = new Logger('Request');

  // Override the default logger
  const originalLog = logger.log;
  logger.log = function (message: string) {
    originalLog.call(this, formatLogMessage(message));
  };

  // Morgan middleware for HTTP request logging
  app.use(
    morgan(
      (tokens: any, req: any, res: any) => {
        const method = chalk.cyan(tokens.method(req, res));
        const url = chalk.green(tokens.url(req, res));
        const status = tokens.status(req, res);
        const responseTime = tokens['response-time'](req, res);

        const statusColor = parseInt(status) >= 400 ? chalk.red : chalk.green;

        return `${method} ${url} ${statusColor(status)} - ${chalk.yellow(responseTime + 'ms')}`;
      },
      {
        stream: {
          write: (message: string) => logger.log(message.replace('\n', '')),
        },
      },
    ),
  );
}
