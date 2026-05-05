import { Controller, Get, UseGuards, Request, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { ResponseHandler } from '../common/helpers/response-handler';
import { messages } from '../common/helpers/message';
import type { Response } from 'express';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(
    private profileService: ProfileService,
    private responseHandler: ResponseHandler,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiOperation({ summary: 'Get the profile of the currently authenticated user' })
  @ApiOkResponse({
    description: 'Profile fetched successfully',
    example: {
      statusCode: 200,
      message: 'Data fetched successfully',
      data: { id: 'uuid', email: 'user@example.com', profile_data: {} },
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
  async getMe(@Request() req: any, @Res() res: Response) {
    try {
      const result = await this.profileService.getProfile(req.user.userId);
      return this.responseHandler.successResponseWithData(res, messages.FETCH_SUCCESS, result);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, messages.INTERNAL_SERVER_ERROR);
    }
  }
}
