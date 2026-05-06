import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Res } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { SponsoredContentService } from "./sponsored-content.service";
import { CreateSponsoredContentDto } from "./dto/create-sponsored-content.dto";
import { UpdateSponsoredContentDto } from "./dto/update-sponsored-content.dto";
import { ResponseHandler } from "../common/helpers/response-handler";
import { Roles } from "../common/decorators/role.decorator";
import { UserRoleEnum } from "../common/helpers/enum";
import { Public } from "../common/decorators/public.decorator";
import type { Response } from "express";

@ApiTags("Sponsored Content")
@Controller("sponsored-content")
export class SponsoredContentController {
  constructor(
    private readonly sponsoredService: SponsoredContentService,
    private responseHandler: ResponseHandler,
  ) {}

  @ApiBearerAuth("JWT-auth")
  @Roles(UserRoleEnum.ADMIN)
  @Post()
  @ApiOperation({ summary: "Create a new sponsored content campaign (Admin only)" })
  @ApiCreatedResponse({
    description: "Campaign created successfully",
    example: {
      statusCode: 201,
      message: "Resource created successfully",
      data: { trendId: "uuid", sponsorName: "Nike", budget: 10000 },
    },
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Admin role required" })
  async create(@Body() dto: CreateSponsoredContentDto, @Res() res: Response) {
    try {
      const result = await this.sponsoredService.create(dto);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message);
    }
  }

  @Public()
  @Get("feed")
  @ApiOperation({ summary: "Get active sponsored trends" })
  @ApiQuery({ name: "limit", required: false, example: 5 })
  @ApiQuery({ name: "offset", required: false, example: 0 })
  @ApiOkResponse({
    description: "Sponsored feed fetched successfully",
    example: {
      statusCode: 200,
      message: "Data fetched successfully",
      data: { data: [], total: 0 },
    },
  })
  async getSponsoredFeed(@Res() res: Response, @Query("limit") limit?: string, @Query("offset") offset?: string) {
    try {
      const limitNum = limit ? parseInt(limit, 10) : 5;
      const offsetNum = offset ? parseInt(offset, 10) : 0;
      const result = await this.sponsoredService.getSponsoredFeed(limitNum, offsetNum);
      return this.responseHandler.successResponseWithData(res, result.message, result.data);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message);
    }
  }

  @ApiBearerAuth("JWT-auth")
  @Roles(UserRoleEnum.ADMIN)
  @Patch(":trendId")
  @ApiOperation({ summary: "Update a sponsored campaign (Admin only)" })
  @ApiOkResponse({ description: "Campaign updated successfully" })
  @ApiNotFoundResponse({ description: "Campaign not found" })
  async update(@Param("trendId") trendId: string, @Body() dto: UpdateSponsoredContentDto, @Res() res: Response) {
    try {
      const result = await this.sponsoredService.update(trendId, dto);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message);
    }
  }

  @ApiBearerAuth("JWT-auth")
  @Roles(UserRoleEnum.ADMIN)
  @Delete(":trendId")
  @ApiOperation({ summary: "Delete a sponsored campaign (Admin only)" })
  @ApiOkResponse({ description: "Campaign deleted successfully" })
  async remove(@Param("trendId") trendId: string, @Res() res: Response) {
    try {
      const result = await this.sponsoredService.remove(trendId);
      if (result.success) {
        return this.responseHandler.successResponse(res, result.message);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message);
    }
  }
}
