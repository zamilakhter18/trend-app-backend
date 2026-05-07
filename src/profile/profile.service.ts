import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from '../db/entities/UserProfile.entity';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import { messages } from '../common/helpers/message';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
  ) {}

  async getProfile(userId: string): Promise<ServiceResponse> {
    const data = await this.profileRepository.findOne({
      where: { userId },
      relations: ['userBadges'],
    });

    if (!data) {
      return {
        success: false,
        message: messages.NOT_FOUND,
      };
    }

    return {
      success: true,
      message: messages.FETCH_SUCCESS,
      data,
    };
  }
}
