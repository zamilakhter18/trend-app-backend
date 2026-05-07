import { Controller, Post, Delete, Body, Request, Res, Query } from "@nestjs/common";
import * as crypto from "crypto";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiInternalServerErrorResponse } from "@nestjs/swagger";
import { InteractionService } from "./interaction.service";
import { InteractDto } from "./dto/interact.dto";
import { SaveDto } from "./dto/save.dto";
import { ClickDto } from "./dto/click.dto";
import { ResponseHandler } from "../common/helpers/response-handler";
import { messages } from "../common/helpers/message";
import { Public } from "../common/decorators/public.decorator";
import type { Response } from "express";

@ApiTags("Interaction")
@ApiBearerAuth("JWT-auth")
@Controller("interaction")
export class InteractionController {
  constructor(
    private interactionService: InteractionService,
    private responseHandler: ResponseHandler,
  ) {}

  @Post("interact")
  @ApiOperation({ summary: "Log a user interaction (VIEW, SAVE, CLICK, SHARE)" })
  @ApiOkResponse({
    description: "Interaction logged successfully",
    example: {
      statusCode: 200,
      message: "Resource updated successfully",
      data: { status: "interacted" },
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
  async interact(@Request() req: any, @Body() interactDto: InteractDto, @Res() res: Response) {
    try {
      const userId = req["user"]?.userId || null;
      const result = await this.interactionService.interact(userId, interactDto);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message || messages.INTERNAL_SERVER_ERROR);
    }
  }

  @Post("save")
  @ApiOperation({ summary: "Save a trend or product to user bookmarks" })
  @ApiCreatedResponse({
    description: "Saved successfully",
    example: {
      statusCode: 201,
      message: "Resource created successfully",
      data: { status: "saved" },
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
  async save(@Request() req: any, @Body() saveDto: SaveDto, @Res() res: Response) {
    try {
      const userId = req["user"]?.userId;
      const result = await this.interactionService.save(userId, saveDto);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message || messages.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete("save")
  @ApiOperation({ summary: "Remove a trend or product from user bookmarks" })
  @ApiOkResponse({
    description: "Unsaved successfully",
    example: {
      statusCode: 200,
      message: "Resource deleted successfully",
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
  async unsave(@Request() req: any, @Query("trend_id") trendId: string, @Query("product_id") productId: string, @Res() res: Response) {
    try {
      const userId = req["user"]?.userId;
      const target: { trendId?: string; productId?: string } = {};
      if (trendId) target.trendId = trendId;
      if (productId) target.productId = productId;

      const result = await this.interactionService.unsave(userId, target);
      if (result.success) {
        return this.responseHandler.successResponse(res, result.message);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message || messages.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Post("click")
  @ApiOperation({ summary: "Track a click on a trend or product (generates CLICK interaction)" })
  @ApiCreatedResponse({
    description: "Click tracked successfully",
    example: {
      statusCode: 201,
      message: "Resource created successfully",
      data: { status: "tracked" },
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
  async trackClick(@Request() req: any, @Body() clickDto: ClickDto, @Res() res: Response) {
    try {
      const ip = (req["ip"] as string) || (req["connection"]?.remoteAddress as string);
      const ipHash = ip ? crypto.createHash("sha256").update(ip).digest("hex") : undefined;

      const userId = req["user"]?.userId || null;
      const result = await this.interactionService.trackClick(userId, clickDto, ipHash);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message || messages.INTERNAL_SERVER_ERROR);
    }
  }
}
