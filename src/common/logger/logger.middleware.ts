import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { PinoLoggerService } from './pino-logger.service.js';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: PinoLoggerService) {}

  use(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    this.logger.log({
      requestMethod: req.method,
      requestUrl: req.originalUrl,
      requestTime: new Date().toISOString(),
    });
    next();
  }
}
