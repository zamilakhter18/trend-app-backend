import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserProfile } from "../db/entities/UserProfile.entity";
import { ServiceResponse } from "../common/interfaces/service-response.interface";
import { messages } from "../common/helpers/message";

@Injectable()
export class IdentityService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
  ) {}

  async getUserPerformance(userId: string): Promise<ServiceResponse> {
    const data = await this.profileRepository.findOne({
      where: { userId },
      relations: ["userBadges", "scoreEvents"],
    });

    if (!data) {
      return {
        success: false,
        message: messages.NOT_FOUND,
      };
    }

    return { success: true, message: messages.FETCH_SUCCESS, data };
  }

  async getLeaderboard(limit: number = 10, page: number = 1): Promise<ServiceResponse> {
    const skip = (page - 1) * limit;
    const [data, totalItems] = await this.profileRepository.findAndCount({
      order: { trendScore: "DESC" },
      take: limit,
      skip: skip,
    });

    return {
      success: true,
      message: messages.FETCH_SUCCESS,
      data: {
        data,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }

  async getProfile(userId: string): Promise<ServiceResponse> {
    const profile = await this.profileRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      return { success: false, message: messages.NOT_FOUND };
    }

    return { success: true, message: messages.FETCH_SUCCESS, data: profile };
  }

  async updateProfile(userId: string, updateData: any): Promise<ServiceResponse> {
    const profile = await this.profileRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      return { success: false, message: messages.NOT_FOUND };
    }

    Object.assign(profile, updateData);
    const updatedProfile = await this.profileRepository.save(profile);

    return { success: true, message: messages.UPDATE_SUCCESS, data: updatedProfile };
  }
}
