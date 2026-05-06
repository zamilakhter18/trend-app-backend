import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  Request,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { EngagementService } from './engagement.service';
import { EngageDto } from './dto/engage.dto';
import { SaveDto } from './dto/save.dto';
import { ClickDto } from './dto/click.dto';
import { ResponseHandler } from '../common/helpers/response-handler';
import { messages } from '../common/helpers/message';
import type { Response } from 'express';

@ApiTags('Engagement')
@ApiBearerAuth('JWT-auth')
@Controller('engagement')
export class EngagementController {
  constructor(
    private engagementService: EngagementService,
    private responseHandler: ResponseHandler,
  ) {}

  @Post('engage')
  @ApiOperation({ summary: 'Log a user engagement (upvote/downvote)' })
  @ApiOkResponse({
    description: 'Engagement logged successfully',
    example: {
      statusCode: 200,
      message: 'Resource updated successfully',
      data: { status: 'engaged' },
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
  async engage(
    @Request() req: any,
    @Body() engageDto: EngageDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.engagementService.engage(
        req.user.userId,
        engageDto,
      );
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

  @Post('save')
  @ApiOperation({ summary: 'Save a trend to user bookmarks' })
  @ApiCreatedResponse({
    description: 'Trend saved successfully',
    example: {
      statusCode: 201,
      message: 'Resource created successfully',
      data: { status: 'saved' },
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
  async save(
    @Request() req: any,
    @Body() saveDto: SaveDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.engagementService.save(req.user.userId, saveDto);
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

  @Delete('save/:trend_id')
  @ApiOperation({ summary: 'Remove a trend from user bookmarks' })
  @ApiOkResponse({
    description: 'Trend unsaved successfully',
    example: {
      statusCode: 200,
      message: 'Resource deleted successfully',
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
  async unsave(
    @Request() req: any,
    @Param('trend_id') trendId: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.engagementService.unsave(
        req.user.userId,
        trendId,
      );
      if (result.success) {
        return this.responseHandler.successResponse(res, result.message);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(
        res,
        (error as Error).message || messages.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('click')
  @ApiOperation({ summary: 'Track a click on a trend or product' })
  @ApiCreatedResponse({
    description: 'Click tracked successfully',
    example: {
      statusCode: 201,
      message: 'Resource created successfully',
      data: { status: 'tracked' },
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
  async trackClick(
    @Request() req: any,
    @Body() clickDto: ClickDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.engagementService.trackClick(
        req.user.userId,
        clickDto,
      );
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
