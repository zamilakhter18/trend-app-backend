import { Module, Global } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserProfile } from "./entities/UserProfile.entity";
import { Trend } from "./entities/Trend.entity";
import { TrendContent } from "./entities/TrendContent.entity";
import { TrendMetadata } from "./entities/TrendMetadata.entity";
import { Interaction } from "./entities/Interaction.entity";
import { Save } from "./entities/Save.entity";
import { Product } from "./entities/Product.entity";
import { Clickout } from "./entities/Clickout.entity";
import { AiAnalysis } from "./entities/AiAnalysis.entity";
import { TrendScore } from "./entities/TrendScore.entity";
import { SponsoredContent } from "./entities/SponsoredContent.entity";
import { Brand } from "./entities/Brand.entity";
import { UserBadge } from "./entities/UserBadge.entity";
import { CreatorProfile } from "./entities/CreatorProfile.entity";
import { CreatorAnalytics } from "./entities/CreatorAnalytics.entity";
import { CreatorCampaign } from "./entities/CreatorCampaign.entity";
import { TrendPhaseHistory } from "./entities/TrendPhaseHistory.entity";
import { ScoreEvent } from "./entities/ScoreEvent.entity";
import { TrendSignal } from "./entities/TrendSignal.entity";
import { EarlyDiscoveryReward } from "./entities/EarlyDiscoveryReward.entity";

const entities = [UserProfile, Trend, TrendContent, TrendMetadata, Interaction, Save, Product, Clickout, AiAnalysis, TrendScore, SponsoredContent, Brand, UserBadge, CreatorProfile, CreatorAnalytics, CreatorCampaign, TrendPhaseHistory, ScoreEvent, TrendSignal, EarlyDiscoveryReward];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  exports: [TypeOrmModule],
})
export class DbModule {}
