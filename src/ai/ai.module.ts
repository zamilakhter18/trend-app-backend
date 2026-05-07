import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AiService } from "./ai.service";
import { AiController } from "./ai.controller";
import { SupabaseModule } from "../supabase/supabase.module";
import { AiAnalysis } from "../db/entities/AiAnalysis.entity";

@Module({
  imports: [SupabaseModule, TypeOrmModule.forFeature([AiAnalysis])],
  providers: [AiService],
  controllers: [AiController],
  exports: [AiService],
})
export class AiModule {}
