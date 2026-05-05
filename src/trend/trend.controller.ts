import { Controller, Get, Param } from '@nestjs/common';
import { TrendService } from './trend.service';
import { AiService } from '../ai/ai.service';

@Controller('trend')
export class TrendController {
  constructor(
    private trendService: TrendService,
    private aiService: AiService,
  ) {}

  @Get(':id')
  async getTrend(@Param('id') id: string) {
    return this.trendService.getTrend(id);
  }

  @Get(':id/explanation')
  async getTrendExplanation(@Param('id') id: string) {
    return this.aiService.getTrendExplanation(id);
  }
}
