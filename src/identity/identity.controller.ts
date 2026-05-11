import { Controller, Get, Patch, Body, Query, Res, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse, ApiInternalServerErrorResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiQuery } from "@nestjs/swagger";
import { IdentityService } from "./identity.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ResponseHandler } from "../common/helpers/response-handler";
import { messages } from "../common/helpers/message";
import type { Response } from "express";
import { Public } from "../common/decorators/public.decorator";
import { Roles } from "../common/decorators/role.decorator";
import { UserRoleEnum } from "../common/helpers/enum";
import { GetFullUser } from "../common/decorators/get-full-user.decorator";
import { UserProfile } from "../db/entities/UserProfile.entity";

@ApiTags("Identity")
@Controller("identity")
export class IdentityController {
  constructor(
    private identityService: IdentityService,
    private responseHandler: ResponseHandler,
  ) {}

  @ApiBearerAuth("JWT-auth")
  @Get("profile")
  @ApiOperation({ summary: "Get the profile of the current user" })
  @ApiOkResponse({
    description: "Profile fetched successfully",
    example: {
      statusCode: 200,
      message: messages.FETCH_SUCCESS,
      data: { userId: "uuid", username: "trendsetter", fullName: "John Doe" },
    },
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiNotFoundResponse({ description: "User profile not found" })
  async getMyProfile(@Request() req: any, @Res() res: Response) {
    try {
      const result = await this.identityService.getProfile(req["user"].userId);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message || messages.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth("JWT-auth")
  @Patch("profile")
  @ApiOperation({ summary: "Update the profile of the current user" })
  @ApiOkResponse({
    description: "Profile updated successfully",
    example: {
      statusCode: 200,
      message: messages.UPDATE_SUCCESS,
      data: { userId: "uuid", username: "trendsetter_new" },
    },
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiBadRequestResponse({ description: "Invalid update data" })
  async updateMyProfile(@Request() req: any, @Body() updateProfileDto: UpdateProfileDto, @Res() res: Response) {
    try {
      const result = await this.identityService.updateProfile(req["user"].userId, updateProfileDto);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message || messages.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth("JWT-auth")
  @Get("performance")
  @ApiOperation({ summary: "Get the performance metrics for the current user" })
  @ApiOkResponse({
    description: "Performance metrics fetched successfully",
    example: {
      statusCode: 200,
      message: messages.FETCH_SUCCESS,
      data: { trust_score: 85, accuracy: 0.9 },
    },
  })
  @ApiBadRequestResponse({
    description: "Bad Request",
    example: {
      statusCode: 400,
      message: messages.BAD_REQUEST,
    },
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized",
    example: {
      statusCode: 401,
      message: messages.UNAUTHORIZED,
    },
  })
  @ApiInternalServerErrorResponse({
    description: "Internal Server Error",
    example: {
      statusCode: 500,
      message: messages.INTERNAL_SERVER_ERROR,
    },
  })
  async getMyPerformance(@GetFullUser() user: UserProfile, @Res() res: Response) {
    try {
      const result = await this.identityService.getUserPerformance(user.userId);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message || messages.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Get("leaderboard")
  @ApiOperation({
    summary: "Get the user leaderboard based on trust and performance",
  })
  @ApiQuery({ name: "limit", required: false, example: 10 })
  @ApiQuery({ name: "page", required: false, example: 1 })
  @ApiOkResponse({
    description: "Leaderboard fetched successfully",
    example: {
      statusCode: 200,
      message: messages.FETCH_SUCCESS,
      data: {
        data: [{ id: "uuid", name: "User Name", trendScore: 100 }],
        totalItems: 100,
        totalPages: 10,
        currentPage: 1
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Bad Request",
    example: {
      statusCode: 400,
      message: messages.BAD_REQUEST,
    },
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized access",
    example: {
      statusCode: 401,
      message: messages.UNAUTHORIZED,
    },
  })
  @ApiInternalServerErrorResponse({
    description: "Internal Server Error",
    example: {
      statusCode: 500,
      message: messages.INTERNAL_SERVER_ERROR,
    },
  })
  async getLeaderboard(@Res() res: Response, @Query("limit") limit?: string, @Query("page") page?: string) {
    try {
      const limitNum = limit ? parseInt(limit, 10) : 10;
      const pageNum = page ? parseInt(page, 10) : 1;
      const result = await this.identityService.getLeaderboard(limitNum, pageNum);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message || messages.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth("JWT-auth")
  @Roles(UserRoleEnum.ADMIN)
  @Get("admin-stats")
  @ApiOperation({ summary: "Admin only statistics" })
  getAdminStats(@Res() res: Response) {
    return this.responseHandler.successResponseWithData(res, "Admin stats fetched", { users: 100, trends: 50 });
  }
}
