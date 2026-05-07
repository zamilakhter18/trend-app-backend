import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RewardsController } from "./rewards.controller";
import { RewardsService } from "./rewards.service";
import { EarlyDiscoveryReward } from "../db/entities/EarlyDiscoveryReward.entity";

@Module({
  imports: [TypeOrmModule.forFeature([EarlyDiscoveryReward])],
  controllers: [RewardsController],
  providers: [RewardsService],
})
export class RewardsModule {}
