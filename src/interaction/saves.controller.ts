import { Controller, Get, Delete, Param, Request, Res } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse } from "@nestjs/swagger";
import { InteractionService } from "./interaction.service";
import { ResponseHandler } from "../common/helpers/response-handler";
import { messages } from "../common/helpers/message";
import type { Response } from "express";

@ApiTags("Saves")
@ApiBearerAuth("JWT-auth")
@Controller("saves")
export class SavesController {
  constructor(
    private interactionService: InteractionService,
    private responseHandler: ResponseHandler,
  ) {}

  @Get()
  @ApiOperation({ summary: "Get all saved trends and products for the current user" })
  @ApiOkResponse({
    description: "Saves fetched successfully",
    example: {
      statusCode: 200,
      message: "Data fetched successfully",
      data: [
        {
          id: "save-uuid",
          trend: { id: "trend-uuid", title: "Trend Title" },
          product: null,
          createdAt: "2023-01-01T00:00:00Z",
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiInternalServerErrorResponse({ description: "Internal Server Error" })
  async getSaves(@Request() req: any, @Res() res: Response) {
    try {
      const userId = req.user.userId;
      const result = await this.interactionService.getSaves(userId);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message || messages.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(":id")
  @ApiOperation({ summary: "Remove a saved item by its save entry ID" })
  @ApiOkResponse({
    description: "Item removed from saves",
    example: {
      statusCode: 200,
      message: "Resource deleted successfully",
    },
  })
  @ApiNotFoundResponse({ description: "Save entry not found" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async deleteSave(@Request() req: any, @Param("id") id: string, @Res() res: Response) {
    try {
      const userId = req.user.userId;
      const result = await this.interactionService.deleteSaveById(userId, id);
      if (result.success) {
        return this.responseHandler.successResponse(res, result.message);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message || messages.INTERNAL_SERVER_ERROR);
    }
  }
}
