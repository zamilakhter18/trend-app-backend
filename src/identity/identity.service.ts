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

  async getLeaderboard(limit: number = 10): Promise<ServiceResponse> {
    const data = await this.profileRepository.find({
      order: { trendScore: "DESC" },
      take: limit,
    });

    return { success: true, message: messages.FETCH_SUCCESS, data };
  }
}
