import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiOkResponse, ApiInternalServerErrorResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiUnauthorizedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TrendService } from './trend.service';
import { AiService } from '../ai/ai.service';
import { ResponseHandler } from '../common/helpers/response-handler';
import type { Response } from 'express';

@ApiTags('Trend')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('trend')
export class TrendController {
  constructor(
    private trendService: TrendService,
    private aiService: AiService,
    private responseHandler: ResponseHandler,
  ) {}

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
