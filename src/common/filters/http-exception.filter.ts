// common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const responseMessage =
      exception instanceof BadRequestException ||
      exception instanceof UnauthorizedException ||
      exception instanceof NotFoundException
        ? exception.getResponse()
        : {
            statusCode: status,
            message: exception.message,
            timestamp: new Date().toISOString(),
            path: request.url,
          };

    response.status(status).json(responseMessage);
  }
}
