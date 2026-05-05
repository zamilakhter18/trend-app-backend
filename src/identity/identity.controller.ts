import { Controller, Get, UseGuards, Request, Query, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { IdentityService } from './identity.service';
import { ResponseHandler } from '../common/helpers/response-handler';
import { messages } from '../common/helpers/message';
import type { Response } from 'express';

@ApiTags('Identity')
@Controller('identity')
export class IdentityController {
  constructor(
    private identityService: IdentityService,
    private responseHandler: ResponseHandler,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('performance')
  @ApiOperation({ summary: 'Get the performance metrics for the current user' })
  @ApiOkResponse({
    description: 'Performance metrics fetched successfully',
    example: {
      statusCode: 200,
      message: 'Data fetched successfully',
      data: { trust_score: 85, accuracy: 0.9 },
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
  async getMyPerformance(@Request() req: any, @Res() res: Response) {
    try {
      const result = await this.identityService.getUserPerformance(req.user.userId);
      return this.responseHandler.successResponseWithData(res, messages.FETCH_SUCCESS, result);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, messages.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get the user leaderboard based on trust and performance' })
  @ApiOkResponse({
    description: 'Leaderboard fetched successfully',
    example: {
      statusCode: 200,
      message: 'Data fetched successfully',
      data: [{ id: 'uuid', name: 'User Name', trust_score: 100 }],
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    example: {
      statusCode: 500,
      message: 'Something went wrong',
    },
  })
  async getLeaderboard(@Res() res: Response, @Query('limit') limit?: string) {
    try {
      const limitNum = limit ? parseInt(limit, 10) : 10;
      const result = await this.identityService.getLeaderboard(limitNum);
      return this.responseHandler.successResponseWithData(res, messages.FETCH_SUCCESS, result);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, messages.INTERNAL_SERVER_ERROR);
    }
  }
}
