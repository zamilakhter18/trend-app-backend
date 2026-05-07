import { Controller, Get, Query, Res } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiOkResponse, ApiQuery } from "@nestjs/swagger";
import { SearchService } from "./search.service";
import { ResponseHandler } from "../common/helpers/response-handler";
import { Public } from "../common/decorators/public.decorator";
import type { Response } from "express";

@ApiTags("Search")
@Controller("search")
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private responseHandler: ResponseHandler,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Search for trends and products" })
  @ApiQuery({ name: "q", required: true, example: "streetwear" })
  @ApiOkResponse({ description: "Search results fetched successfully" })
  async search(@Query("q") query: string, @Res() res: Response) {
    const result = await this.searchService.search(query);
    return this.responseHandler.successResponseWithData(res, "Search successful", result);
  }
}
