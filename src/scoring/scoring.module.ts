import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoringService } from './scoring.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { Trend } from '../db/entities/Trend.entity';
import { TrendScore } from '../db/entities/TrendScore.entity';
import { Engagement } from '../db/entities/Engagement.entity';
import { Save } from '../db/entities/Save.entity';
import { Clickout } from '../db/entities/Clickout.entity';

@Module({
  imports: [
    SupabaseModule,
    TypeOrmModule.forFeature([Trend, TrendScore, Engagement, Save, Clickout]),
  ],
  providers: [ScoringService],
  exports: [ScoringService],
})
export class ScoringModule {}
