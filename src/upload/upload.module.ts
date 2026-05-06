import { Module } from "@nestjs/common";
import { SupabaseModule } from "../supabase/supabase.module";
import { UploadService } from "./upload.service";
import { UploadController } from "./upload.controller";

@Module({
  imports: [SupabaseModule],
  providers: [UploadService],
  controllers: [UploadController],
  exports: [UploadService],
})
export class UploadModule {}
