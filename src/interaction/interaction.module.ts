import { Module } from "@nestjs/common";
import { InteractionService } from "./interaction.service";
import { InteractionController } from "./interaction.controller";
import { SavesController } from "./saves.controller";
import { SupabaseModule } from "../supabase/supabase.module";

@Module({
  imports: [SupabaseModule],
  providers: [InteractionService],
  controllers: [InteractionController, SavesController],
  exports: [InteractionService],
})
export class InteractionModule {}
