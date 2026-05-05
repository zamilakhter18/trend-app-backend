import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ResponseHandler } from './common/helpers/response-handler';
import { messages } from './common/helpers/message';
import type { Response } from 'express';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private responseHandler: ResponseHandler,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiOkResponse({
    description: 'Health check successful',
    example: {
      statusCode: 200,
      message: 'Data fetched successfully',
      data: 'Hello World!',
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    example: {
      statusCode: 500,
      message: 'Something went wrong',
    },
  })
  getHello(@Res() res: Response) {
    try {
      const result = this.appService.getHello();
      return this.responseHandler.successResponseWithData(res, messages.FETCH_SUCCESS, result);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, messages.INTERNAL_SERVER_ERROR);
    }
  }
}
