import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IdentityService } from './identity.service';

@Controller('identity')
export class IdentityController {
  constructor(private identityService: IdentityService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('performance')
  async getMyPerformance(@Request() req) {
    return this.identityService.getUserPerformance(req.user.userId);
  }

  @Get('leaderboard')
  async getLeaderboard(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.identityService.getLeaderboard(limitNum);
  }
}
