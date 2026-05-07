import { Controller, Get, Query, Res } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse, ApiInternalServerErrorResponse, ApiBadRequestResponse } from "@nestjs/swagger";
import { IdentityService } from "./identity.service";
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
  async getAdminStats(@Res() res: Response) {
    return this.responseHandler.successResponseWithData(res, "Admin stats fetched", { users: 100, trends: 50 });
  }
}
