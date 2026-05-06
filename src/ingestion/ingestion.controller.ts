import { Controller, Post, Body, Headers, Res, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiHeader,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IngestionService } from './ingestion.service';
import { SocialImportDto } from './dto/social-import.dto';
import { IngestionRunDto } from './dto/ingestion-run.dto';
import { ResponseHandler } from '../common/helpers/response-handler';
import { Roles } from '../common/decorators/role.decorator';
import { UserRoleEnum } from '../common/helpers/enum';
import { Public } from '../common/decorators/public.decorator';
import type { Response } from 'express';

@ApiTags('Data Ingestion')
@Controller()
export class IngestionController {
  constructor(
    private readonly ingestionService: IngestionService,
    private responseHandler: ResponseHandler,
  ) {}

  @Public()
  @Post('ingestion/social-import')
  @ApiOperation({ summary: 'Receive trend data from Python ingestion pipeline' })
  @ApiHeader({
    name: 'x-ingestion-token',
    description: 'Internal service authentication token',
    required: true,
  })
  @ApiCreatedResponse({
    description: 'Trend imported successfully',
    example: {
      statusCode: 201,
      message: 'Resource created successfully',
      data: { id: 'uuid', title: 'Minimal Fashion' }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing ingestion token' })
  @ApiBadRequestResponse({ description: 'Trend already exists or malformed payload' })
  async socialImport(
    @Body() dto: SocialImportDto,
    @Headers('x-ingestion-token') token: string,
    @Res() res: Response,
  ) {
    try {
      this.ingestionService.validateToken(token);
      const result = await this.ingestionService.importSocialTrend(dto);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message);
    }
  }

  @ApiBearerAuth('JWT-auth')
  @Roles(UserRoleEnum.ADMIN)
  @Post('admin/ingestion/run')
  @ApiOperation({ summary: 'Manually trigger the ingestion pipeline (Admin only)' })
  @ApiOkResponse({
    description: 'Pipeline triggered',
    example: {
      statusCode: 200,
      message: 'Ingestion pipeline triggered successfully'
    }
  })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async triggerRun(@Body() dto: IngestionRunDto, @Res() res: Response) {
    try {
      const result = await this.ingestionService.triggerPipeline(dto);
      if (result.success) {
        return this.responseHandler.successResponse(res, result.message);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message);
    }
  }
}
