import { Module } from "@nestjs/common";
import { TrendService } from "./trend.service";
import { TrendController } from "./trend.controller";
import { SupabaseModule } from "../supabase/supabase.module";
import { AiModule } from "../ai/ai.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [SupabaseModule, AiModule, AuthModule],
  providers: [TrendService],
  controllers: [TrendController],
  exports: [TrendService],
})
export class TrendModule {}
