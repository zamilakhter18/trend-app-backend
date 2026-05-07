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

const entities = [UserProfile, Trend, TrendContent, TrendMetadata, Interaction, Save, Product, Clickout, AiAnalysis, TrendScore, SponsoredContent, Brand, UserBadge, CreatorProfile, CreatorAnalytics, CreatorCampaign];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  exports: [TypeOrmModule],
})
export class DbModule {}
