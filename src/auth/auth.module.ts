import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { SupabaseModule } from "../supabase/supabase.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserProfile } from "../db/entities/UserProfile.entity";

@Module({
  imports: [SupabaseModule, TypeOrmModule.forFeature([UserProfile])],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

