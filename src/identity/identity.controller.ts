import { Controller, Get, Patch, Body, Query, Res, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse, ApiInternalServerErrorResponse, ApiBadRequestResponse, ApiNotFoundResponse } from "@nestjs/swagger";
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
      message: "Data fetched successfully",
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
      message: "Resource updated successfully",
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
      message: "Data fetched successfully",
      data: { trust_score: 85, accuracy: 0.9 },
    },
  })
  @ApiBadRequestResponse({
    description: "Bad Request",
    example: {
      statusCode: 400,
      message: "Bad request",
    },
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized",
    example: {
      statusCode: 401,
      message: "Unauthorized access",
    },
  })
  @ApiInternalServerErrorResponse({
    description: "Internal Server Error",
    example: {
      statusCode: 500,
      message: "Something went wrong",
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
  @ApiOkResponse({
    description: "Leaderboard fetched successfully",
    example: {
      statusCode: 200,
      message: "Data fetched successfully",
      data: [{ id: "uuid", name: "User Name", trust_score: 100 }],
    },
  })
  @ApiBadRequestResponse({
    description: "Bad Request",
    example: {
      statusCode: 400,
      message: "Bad request",
    },
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized access",
    example: {
      statusCode: 401,
      message: "Unauthorized access",
    },
  })
  @ApiInternalServerErrorResponse({
    description: "Internal Server Error",
    example: {
      statusCode: 500,
      message: "Something went wrong",
    },
  })
  async getLeaderboard(@Res() res: Response, @Query("limit") limit?: string) {
    try {
      const limitNum = limit ? parseInt(limit, 10) : 10;
      const result = await this.identityService.getLeaderboard(limitNum);
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
