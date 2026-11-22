import { Injectable, type LoggerService } from '@nestjs/common';
import pino from 'pino';

@Injectable()
export class PinoLoggerService implements LoggerService {
  private readonly logger = pino({
    level: process.env.LOG_LEVEL ?? 'info',
    redact: {
      paths: [
        'password',
        '*.password',
        'req.headers.authorization',
        'user.token',
      ],
      censor: '[REDACTED]',
    },
  });

  log(message: unknown, ...optionalParams: unknown[]) {
    this.write('info', message, optionalParams);
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    this.write('error', message, optionalParams);
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    this.write('warn', message, optionalParams);
  }

  debug(message: unknown, ...optionalParams: unknown[]) {
    this.write('debug', message, optionalParams);
  }

  verbose(message: unknown, ...optionalParams: unknown[]) {
    this.write('trace', message, optionalParams);
  }

  private write(
    level: 'info' | 'error' | 'warn' | 'debug' | 'trace',
    message: unknown,
    optionalParams: unknown[],
  ) {
    const context = optionalParams.at(-1);
    const bindings = typeof context === 'string' ? { context } : undefined;
    if (typeof message === 'object' && message !== null && !(message instanceof Error)) {
      this.logger[level]({ ...(message as Record<string, unknown>), ...bindings });
      return;
    }
    const text =
      message instanceof Error
        ? message.stack ?? message.message
        : typeof message === 'string'
          ? message
          : JSON.stringify(message);
    this.logger[level](bindings ?? {}, text ?? '');
  }
}
