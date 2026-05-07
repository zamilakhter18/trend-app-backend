import { Module } from "@nestjs/common";
import { InteractionService } from "./interaction.service";
import { InteractionController } from "./interaction.controller";
import { SupabaseModule } from "../supabase/supabase.module";

@Module({
  imports: [SupabaseModule],
  providers: [InteractionService],
  controllers: [InteractionController],
  exports: [InteractionService],
})
export class InteractionModule {}
