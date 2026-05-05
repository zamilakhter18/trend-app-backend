import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

  @UseInterceptors(CacheInterceptor)
  @Get()
  async getFeed(
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.feedService.getFeed(limitNum, cursor);
  }
}
