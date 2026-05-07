import { Module } from "@nestjs/common";
import { IdentityService } from "./identity.service";
import { IdentityController } from "./identity.controller";
import { SupabaseModule } from "../supabase/supabase.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [SupabaseModule, AuthModule],
  providers: [IdentityService],
  controllers: [IdentityController],
})
export class IdentityModule {}
