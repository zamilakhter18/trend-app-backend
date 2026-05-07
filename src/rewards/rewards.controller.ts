import { Controller, Post, Get, Param, Res } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiNotFoundResponse, ApiUnauthorizedResponse, ApiInternalServerErrorResponse } from "@nestjs/swagger";
import { RewardsService } from "./rewards.service";
import { ResponseHandler } from "../common/helpers/response-handler";
import { GetFullUser } from "../common/decorators/get-full-user.decorator";
import { UserProfile } from "../db/entities/UserProfile.entity";
import type { Response } from "express";

@ApiTags("Rewards")
@Controller("rewards")
export class RewardsController {
  constructor(
    private readonly rewardsService: RewardsService,
    private responseHandler: ResponseHandler,
  ) {}

  @ApiBearerAuth("JWT-auth")
  @Get()
  @ApiOperation({ summary: "Get all rewards for the current user" })
  @ApiOkResponse({
    description: "Rewards fetched successfully",
    example: {
      statusCode: 200,
      message: "Data fetched successfully",
      data: [{ id: "uuid", rewardType: "EARLY_DISCOVERY", claimed: false }],
    },
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiInternalServerErrorResponse({ description: "Internal Server Error" })
  async getRewards(@GetFullUser() user: UserProfile, @Res() res: Response) {
    try {
      const result = await this.rewardsService.getUserRewards(user.userId);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message);
    }
  }

  @ApiBearerAuth("JWT-auth")
  @Post("claim/:rewardId")
  @ApiOperation({ summary: "Claim an earned early discovery reward" })
  @ApiOkResponse({ description: "Reward claimed successfully" })
  @ApiNotFoundResponse({ description: "Reward not found" })
  async claim(@Param("rewardId") rewardId: string, @GetFullUser() user: UserProfile, @Res() res: Response) {
    const result = await this.rewardsService.claimReward(user.userId, rewardId);
    if (result.success) {
      return this.responseHandler.successResponse(res, result.message);
    }
    return this.responseHandler.errorResponse(res, result.message);
  }
}
