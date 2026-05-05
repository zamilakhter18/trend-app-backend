import { Controller, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EngagementService } from './engagement.service';
import { EngageDto } from './dto/engage.dto';
import { SaveDto } from './dto/save.dto';
import { ClickDto } from './dto/click.dto';

@ApiTags('Engagement')
@Controller('engagement')
export class EngagementController {
  constructor(private engagementService: EngagementService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('engage')
  @ApiOperation({ summary: 'Log a user engagement (upvote/downvote)' })
  async engage(@Request() req: any, @Body() engageDto: EngageDto) {
    return this.engagementService.engage(req.user.userId, engageDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('save')
  @ApiOperation({ summary: 'Save a trend to user bookmarks' })
  async save(@Request() req: any, @Body() saveDto: SaveDto) {
    return this.engagementService.save(req.user.userId, saveDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('save/:trend_id')
  @ApiOperation({ summary: 'Remove a trend from user bookmarks' })
  async unsave(@Request() req: any, @Param('trend_id') trendId: string) {
    return this.engagementService.unsave(req.user.userId, trendId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('click')
  @ApiOperation({ summary: 'Track a click on a trend or product' })
  async trackClick(@Request() req: any, @Body() clickDto: ClickDto) {
    return this.engagementService.trackClick(req.user.userId, clickDto);
  }
}
