import { Injectable, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class ResponseHandler {
  successResponse(res: Response, msg: string) {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: msg,
    });
  }

  successResponseWithData(res: Response, msg: string, data: any) {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: msg,
      data: data,
    });
  }

  successResponseWithToken(res: Response, msg: string, token: string) {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: msg,
      data: { token },
    });
  }

  successResponseWithDataAndToken(res: Response, msg: string, data: any, token: string) {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: msg,
      data: { ...data, token },
    });
  }

  errorResponse(res: Response, msg: string) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: msg,
    });
  }

  errorResponseWithData(res: Response, msg: string, data: any) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: msg,
      data: data,
    });
  }

  unAuthorizeErrorResponse(res: Response, msg: string) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: msg,
    });
  }

  forbiddenErrorResponse(res: Response, msg: string) {
    return res.status(HttpStatus.FORBIDDEN).json({
      statusCode: HttpStatus.FORBIDDEN,
      message: msg,
    });
  }

  catchErrorResponse(res: Response, msg: string) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: msg,
    });
  }
}
