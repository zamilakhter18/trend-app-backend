import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IdentityService } from './identity.service';

@ApiTags('Identity')
@Controller('identity')
export class IdentityController {
  constructor(private identityService: IdentityService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('performance')
  @ApiOperation({ summary: 'Get the performance metrics for the current user' })
  async getMyPerformance(@Request() req: any) {
    return this.identityService.getUserPerformance(req.user.userId);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get the user leaderboard based on trust and performance' })
  async getLeaderboard(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.identityService.getLeaderboard(limitNum);
  }
}
