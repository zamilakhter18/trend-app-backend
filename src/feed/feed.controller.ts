import { Controller, Get, Query, UseInterceptors, Res } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiOkResponse, ApiInternalServerErrorResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiQuery } from "@nestjs/swagger";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { FeedService } from "./feed.service";
import { ResponseHandler } from "../common/helpers/response-handler";
import { messages } from "../common/helpers/message";
import type { Response } from "express";
import { Public } from "../common/decorators/public.decorator";

@ApiTags("Feed")
@Controller("feed")
export class FeedController {
  constructor(
    private feedService: FeedService,
    private responseHandler: ResponseHandler,
  ) {}

  @Public()
  @UseInterceptors(CacheInterceptor)
  @Get()
  @ApiOperation({
    summary: "Get the personalized trend feed",
    description: "Returns a list of trends ranked by a combination of engagement velocity, save rate, and click-through rate, with a time-decay penalty for older content.",
  })
  @ApiQuery({ name: "limit", required: false, example: 10, description: "Number of trends to return" })
  @ApiQuery({ name: "cursor", required: false, description: "Base64 encoded cursor for pagination" })
  @ApiOkResponse({
    description: "Feed fetched successfully",
    example: {
      statusCode: 200,
      message: "Data fetched successfully",
      data: {
        data: [{ id: "uuid", title: "Trend Title", score: { finalScore: 85.5 } }],
        nextCursor: "base64-string",
      },
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
  async getFeed(@Res() res: Response, @Query("limit") limit?: string, @Query("cursor") cursor?: string) {
    try {
      const limitNum = limit ? parseInt(limit, 10) : 10;
      const result = await this.feedService.getFeed(limitNum, cursor);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message || messages.INTERNAL_SERVER_ERROR);
    }
  }
}
