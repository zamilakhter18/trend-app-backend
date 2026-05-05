import { Controller, Get, Param } from '@nestjs/common';
import { TrendService } from './trend.service';

@Controller('trend')
export class TrendController {
  constructor(private trendService: TrendService) {}

  @Get(':id')
  async getTrend(@Param('id') id: string) {
    return this.trendService.getTrend(id);
  }
}
