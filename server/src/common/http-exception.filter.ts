import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import type { ApiErrorBody } from './types/api.types.js';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      const hasDetails =
        typeof body === 'object' && body !== null && 'details' in body;
      const payload: ApiErrorBody = hasDetails
        ? (body as ApiErrorBody)
        : { error: exception.message };
      res.status(exception.getStatus()).json(payload);
      return;
    }

    this.logger.error(exception);
    const payload: ApiErrorBody = { error: 'Internal server error' };
    res.status(500).json(payload);
  }
}
