import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiInternalServerErrorResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiUnauthorizedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TrendService } from './trend.service';
import { AiService } from '../ai/ai.service';
import { ResponseHandler } from '../common/helpers/response-handler';
import type { Response } from 'express';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Trend')
@Controller('trend')
export class TrendController {
  constructor(
    private trendService: TrendService,
    private aiService: AiService,
    private responseHandler: ResponseHandler,
  ) {}

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific trend' })
  @ApiOkResponse({
    description: 'Trend details fetched successfully',
    example: {
      statusCode: 200,
      message: 'Data fetched successfully',
      data: { id: 'uuid', title: 'Trend Title', description: 'Trend Description' },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    example: {
      statusCode: 400,
      message: 'Bad request',
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: {
      statusCode: 401,
      message: 'Unauthorized access',
    },
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
    example: {
      statusCode: 404,
      message: 'Resource not found',
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    example: {
      statusCode: 500,
      message: 'Something went wrong',
    },
  })
  async getTrend(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.trendService.getTrend(id);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message);
    }
  }

  @ApiBearerAuth('JWT-auth')
  @Get(':id/explanation')
  @ApiOperation({ summary: 'Get AI-generated explanation for a trend' })
  @ApiOkResponse({
    description: 'Trend explanation fetched successfully',
    example: {
      statusCode: 200,
      message: 'Data fetched successfully',
      data: { explanation: 'This trend is about...' },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    example: {
      statusCode: 400,
      message: 'Bad request',
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: {
      statusCode: 401,
      message: 'Unauthorized access',
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    example: {
      statusCode: 500,
      message: 'Something went wrong',
    },
  })
  async getTrendExplanation(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.aiService.getTrendExplanation(id);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message);
    }
  }
}
