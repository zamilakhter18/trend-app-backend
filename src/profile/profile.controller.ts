import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse, ApiInternalServerErrorResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { ResponseHandler } from '../common/helpers/response-handler';
import type { Response } from 'express';
import { GetFullUser } from '../common/decorators/get-full-user.decorator';
import { UserProfile } from '../db/entities/UserProfile.entity';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(
    private profileService: ProfileService,
    private responseHandler: ResponseHandler,
  ) {}

  @ApiBearerAuth()
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
  async getMe(@GetFullUser() user: UserProfile, @Res() res: Response) {
    try {
      const result = await this.profileService.getProfile(user.userId);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message);
    }
  }
}
