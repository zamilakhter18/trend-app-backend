import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IngestionService } from "./ingestion.service";
import { IngestionController } from "./ingestion.controller";
import { Trend } from "../db/entities/Trend.entity";
import { TrendMetadata } from "../db/entities/TrendMetadata.entity";
import { TrendScore } from "../db/entities/TrendScore.entity";
import { TrendContent } from "../db/entities/TrendContent.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Trend, TrendMetadata, TrendScore, TrendContent])],
  providers: [IngestionService],
  controllers: [IngestionController],
  exports: [IngestionService],
})
export class IngestionModule {}
