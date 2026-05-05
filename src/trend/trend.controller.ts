import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TrendService } from './trend.service';
import { AiService } from '../ai/ai.service';

@ApiTags('Trend')
@Controller('trend')
export class TrendController {
  constructor(
    private trendService: TrendService,
    private aiService: AiService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific trend' })
  async getTrend(@Param('id') id: string) {
    return this.trendService.getTrend(id);
  }

  @Get(':id/explanation')
  @ApiOperation({ summary: 'Get AI-generated explanation for a trend' })
  async getTrendExplanation(@Param('id') id: string) {
    return this.aiService.getTrendExplanation(id);
  }
}
