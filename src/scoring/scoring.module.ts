import { Module } from "@nestjs/common";
import { ScoringService } from "./scoring.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Trend } from "../db/entities/Trend.entity";
import { TrendScore } from "../db/entities/TrendScore.entity";
import { Interaction } from "../db/entities/Interaction.entity";
import { Save } from "../db/entities/Save.entity";
import { Clickout } from "../db/entities/Clickout.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Trend, TrendScore, Interaction, Save, Clickout])],
  providers: [ScoringService],
  exports: [ScoringService],
})
export class ScoringModule {}
