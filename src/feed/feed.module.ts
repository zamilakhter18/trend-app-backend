import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FeedService } from "./feed.service";
import { FeedController } from "./feed.controller";
import { SupabaseModule } from "../supabase/supabase.module";
import { AuthModule } from "../auth/auth.module";
import { Trend } from "../db/entities/Trend.entity";
import { SponsoredContentModule } from "../sponsored-content/sponsored-content.module";

@Module({
  imports: [SupabaseModule, AuthModule, SponsoredContentModule, TypeOrmModule.forFeature([Trend])],
  providers: [FeedService],
  controllers: [FeedController],
})
export class FeedModule {}
