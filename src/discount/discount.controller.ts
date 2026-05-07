import { Controller, Get, Res } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiOkResponse, ApiInternalServerErrorResponse } from "@nestjs/swagger";
import { DiscountService } from "./discount.service";
import { ResponseHandler } from "../common/helpers/response-handler";
import { messages } from "../common/helpers/message";
import { Public } from "../common/decorators/public.decorator";
import type { Response } from "express";

@ApiTags("Discounts")
@Controller("discounts")
export class DiscountController {
  constructor(
    private readonly discountService: DiscountService,
    private responseHandler: ResponseHandler,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "List all available discount codes and perks" })
  @ApiOkResponse({
    description: "Discounts fetched successfully",
    example: {
      statusCode: 200,
      message: "Data fetched successfully",
      data: [{ id: "uuid", code: "SAVE10", discountValue: 10, brand: { name: "Brand Name" } }],
    },
  })
  @ApiInternalServerErrorResponse({ description: "Internal Server Error" })
  async findAll(@Res() res: Response) {
    try {
      const result = await this.discountService.findAllAvailable();
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message || messages.INTERNAL_SERVER_ERROR);
    }
  }
}
