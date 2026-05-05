import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Request() req) {
    return this.profileService.getProfile(req.user.userId);
  }
}
