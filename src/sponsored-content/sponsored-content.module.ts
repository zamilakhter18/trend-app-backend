import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SponsoredContentService } from "./sponsored-content.service";
import { SponsoredContentController } from "./sponsored-content.controller";
import { SponsoredContent } from "../db/entities/SponsoredContent.entity";
import { Trend } from "../db/entities/Trend.entity";

@Module({
  imports: [TypeOrmModule.forFeature([SponsoredContent, Trend])],
  providers: [SponsoredContentService],
  controllers: [SponsoredContentController],
  exports: [SponsoredContentService],
})
export class SponsoredContentModule {}
