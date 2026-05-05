import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ScoringService {
  private readonly logger = new Logger(ScoringService.name);

  constructor(private supabaseService: SupabaseService) {}

  async updateAllTrendScores() {
    this.logger.log('Starting global trend score update...');
    const client = this.supabaseService.getClient();

    // 1. Fetch all trends
    const { data: trends, error: trendsError } = await client
      .from('trends')
      .select('id, created_at');

    if (trendsError) {
      this.logger.error(`Error fetching trends: ${trendsError.message}`);
      return;
    }

    for (const trend of trends) {
      await this.calculateAndStoreScore(trend.id, trend.created_at);
    }

    this.logger.log('Trend score update complete.');
  }

  async calculateAndStoreScore(trendId: string, createdAt: string) {
    const client = this.supabaseService.getClient();

    // 2. Fetch engagement count (simple count for now)
    const { count: engagementCount, error: engError } = await client
      .from('engagements')
      .select('*', { count: 'exact', head: true })
      .eq('trend_id', trendId);

    if (engError) {
      this.logger.error(`Error fetching engagements for trend ${trendId}: ${engError.message}`);
      return;
    }

    // 3. Simple Algorithm:
    // Score = EngagementCount / (HoursSinceCreation + 2)^1.5
    const createdDate = new Date(createdAt);
    const now = new Date();
    const hoursSinceCreation = Math.abs(now.getTime() - createdDate.getTime()) / 36e5;

    const score = (engagementCount || 0) / Math.pow(hoursSinceCreation + 2, 1.5);

    // 4. Update trend_scores table
    const { error: upsertError } = await client
      .from('trend_scores')
      .upsert({
        trend_id: trendId,
        score: score,
        engagement_count: engagementCount || 0,
        last_updated: new Date().toISOString(),
      });

    if (upsertError) {
      this.logger.error(`Error upserting score for trend ${trendId}: ${upsertError.message}`);
    }
  }
}
