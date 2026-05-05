import { Controller, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EngagementService } from './engagement.service';
import { EngageDto } from './dto/engage.dto';
import { SaveDto } from './dto/save.dto';
import { ClickDto } from './dto/click.dto';

@Controller('engagement')
export class EngagementController {
  constructor(private engagementService: EngagementService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('engage')
  async engage(@Request() req, @Body() engageDto: EngageDto) {
    return this.engagementService.engage(req.user.userId, engageDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('save')
  async save(@Request() req, @Body() saveDto: SaveDto) {
    return this.engagementService.save(req.user.userId, saveDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('save/:trend_id')
  async unsave(@Request() req, @Param('trend_id') trendId: string) {
    return this.engagementService.unsave(req.user.userId, trendId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('click')
  async trackClick(@Request() req, @Body() clickDto: ClickDto) {
    return this.engagementService.trackClick(req.user.userId, clickDto);
  }
}
