import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EarlyDiscoveryReward } from "../db/entities/EarlyDiscoveryReward.entity";
import { ServiceResponse } from "../common/interfaces/service-response.interface";

@Injectable()
export class RewardsService {
  constructor(
    @InjectRepository(EarlyDiscoveryReward)
    private rewardRepository: Repository<EarlyDiscoveryReward>,
  ) {}

  async claimReward(userId: string, rewardId: string): Promise<ServiceResponse> {
    const reward = await this.rewardRepository.findOne({
      where: { id: rewardId, userId, claimed: false },
    });

    if (!reward) {
      return { success: false, message: "Reward not found or already claimed" };
    }

    reward.claimed = true;
    await this.rewardRepository.save(reward);

    return { success: true, message: "Reward claimed successfully" };
  }

  async getUserRewards(userId: string): Promise<ServiceResponse> {
    const rewards = await this.rewardRepository.find({
      where: { userId },
    });

    return { success: true, message: "Rewards fetched successfully", data: rewards };
  }
}
