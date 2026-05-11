import { Controller, Get, Post, Patch, Param, Body, Query, Res } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiQuery } from "@nestjs/swagger";
import { AdminService } from "./admin.service";
import { TrendService } from "../trend/trend.service";
import { CreateTrendDto } from "../trend/dto/create-trend.dto";
import { UpdateTrendDto } from "../trend/dto/update-trend.dto";
import { ResponseHandler } from "../common/helpers/response-handler";
import { Roles } from "../common/decorators/role.decorator";
import { UserRoleEnum } from "../common/helpers/enum";
import { GetFullUser } from "../common/decorators/get-full-user.decorator";
import { UserProfile } from "../db/entities/UserProfile.entity";
import type { Response } from "express";

@ApiTags("Admin")
@ApiBearerAuth("JWT-auth")
@Roles(UserRoleEnum.ADMIN)
@Controller("admin")
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly trendService: TrendService,
    private readonly responseHandler: ResponseHandler,
  ) {}

  @Post("trends")
  @ApiOperation({ summary: "Create a new trend (Admin only)" })
  @ApiCreatedResponse({
    description: "Trend created successfully",
    example: {
      statusCode: 201,
      message: "Resource created successfully",
      data: { id: "uuid", title: "New Trend" },
    },
  })
  async createTrend(@Body() createTrendDto: CreateTrendDto, @GetFullUser() user: UserProfile, @Res() res: Response) {
    try {
      const result = await this.trendService.createTrend(user.userId, createTrendDto);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message);
    }
  }

  @Patch("trends/:id")
  @ApiOperation({ summary: "Update an existing trend (Admin only)" })
  @ApiOkResponse({
    description: "Trend updated successfully",
    example: {
      statusCode: 200,
      message: "Resource updated successfully",
      data: { id: "uuid", title: "Updated Trend" },
    },
  })
  @ApiNotFoundResponse({ description: "Trend not found" })
  async updateTrend(@Param("id") id: string, @Body() updateTrendDto: UpdateTrendDto, @Res() res: Response) {
    try {
      const result = await this.trendService.updateTrend(id, updateTrendDto);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message);
    }
  }

  @Get("score-events")
  @ApiOperation({ summary: "Get all score audit events (Admin only)" })
  @ApiQuery({ name: "limit", required: false, example: 50 })
  @ApiQuery({ name: "page", required: false, example: 1 })
  @ApiOkResponse({
    description: "Score events fetched successfully",
    example: {
      statusCode: 200,
      message: "Data fetched successfully",
      data: {
        events: [{ id: "uuid", pointsDelta: 10, reason: "EARLY_DISCOVERY" }],
        totalItems: 100,
        totalPages: 2,
        currentPage: 1
      },
    },
  })
  async getScoreEvents(@Query("limit") limit: string, @Query("page") page: string, @Res() res: Response) {
    try {
      const limitNum = limit ? parseInt(limit, 10) : 50;
      const pageNum = page ? parseInt(page, 10) : 1;
      const result = await this.adminService.getAllScoreEvents(limitNum, pageNum);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message);
    }
  }
}
