import {
  Controller,
  Get,
  Query,
  UseInterceptors,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { FeedService } from './feed.service';
import { ResponseHandler } from '../common/helpers/response-handler';
import { messages } from '../common/helpers/message';
import type { Response } from 'express';

@ApiTags('Feed')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('feed')
export class FeedController {
  constructor(
    private feedService: FeedService,
    private responseHandler: ResponseHandler,
  ) {}

  @UseInterceptors(CacheInterceptor)
  @Get()
  @ApiOperation({ summary: 'Get the personalized trend feed' })
  @ApiOkResponse({
    description: 'Feed fetched successfully',
    example: {
      statusCode: 200,
      message: 'Data fetched successfully',
      data: [{ id: 'uuid', title: 'Trend Title', score: 100 }],
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
    description: 'Unauthorized access',
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
  async getFeed(
    @Res() res: Response,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    try {
      const limitNum = limit ? parseInt(limit, 10) : 10;
      const result = await this.feedService.getFeed(limitNum, cursor);
      if (result.success) {
        return this.responseHandler.successResponseWithData(
          res,
          result.message,
          result.data,
        );
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(
        res,
        (error as Error).message || messages.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
