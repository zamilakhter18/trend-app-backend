import { Module } from '@nestjs/common';
import { ScoringService } from './scoring.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  providers: [ScoringService],
  exports: [ScoringService],
})
export class ScoringModule {}
