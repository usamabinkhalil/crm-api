import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { MongoError } from 'mongodb';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    console.error(exception);

    let status: number;
    let message: string | object;

    if (exception instanceof MongoError) {
      status = HttpStatus.CONFLICT;
      if (exception.code === 11000) {
        const keyValue = (exception as any).keyValue;
        const duplicateField = Object.keys(keyValue)[0];
        message = `The ${duplicateField} "${keyValue[duplicateField]}" already exists. Please use a different one.`;
      } else {
        message = exception.message;
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message || exception.getResponse();
    } else if (exception instanceof Error) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }

    const rData = {
      statusCode: status,
      message: typeof message === 'object' ? (message as any).message : message,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(rData);
  }
}
