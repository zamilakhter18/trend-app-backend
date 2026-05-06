import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AiService } from './ai.service';
import { AnalyzeTrendDto } from './dto/analyze-trend.dto';
import { ClassifyImageDto } from './dto/classify-image.dto';
import { ResponseHandler } from '../common/helpers/response-handler';
import { Roles } from '../common/decorators/role.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import type { Response } from 'express';

@ApiTags('AI Intelligence')
@ApiBearerAuth()
@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private responseHandler: ResponseHandler,
  ) {}

  @Post('analyze-trend')
  @Roles(UserRole.ADMIN, UserRole.CREATOR)
  @ApiOperation({ summary: 'Analyze trend content using LLM (Admin/Creator only)' })
  @ApiCreatedResponse({
    description: 'Trend analysis completed and stored',
    example: {
      statusCode: 201,
      message: 'Resource created successfully',
      data: {
        summary: 'AI in fashion...',
        tags: ['AI', 'Fashion'],
        sentiment: 'positive',
        category: 'Tech',
        provider: 'openai-gpt-4'
      }
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async analyzeTrend(@Body() dto: AnalyzeTrendDto, @Res() res: Response) {
    try {
      const result = await this.aiService.analyzeTrend(dto);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message);
    }
  }

  @Post('classify-image')
  @ApiOperation({ summary: 'Classify an image using Vision API' })
  @ApiOkResponse({
    description: 'Image detection results',
    example: {
      statusCode: 200,
      message: 'Image classification complete',
      data: {
        labels: ['apparel', 'sneakers'],
        category: 'fashion',
        aesthetic: 'minimalist',
        isSafe: true,
        provider: 'google-vision-ai'
      }
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid image URL' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async classifyImage(@Body() dto: ClassifyImageDto, @Res() res: Response) {
    try {
      const result = await this.aiService.classifyImage(dto);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message);
    }
  }
}
