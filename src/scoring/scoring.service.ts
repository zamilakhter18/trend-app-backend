import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SupabaseService } from '../supabase/supabase.service';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import { messages } from '../common/helpers/message';

@Injectable()
export class ScoringService {
  private readonly logger = new Logger(ScoringService.name);

  constructor(private supabaseService: SupabaseService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.debug('Called every hour');
    await this.updateAllTrendScores();
  }

  async updateAllTrendScores(): Promise<ServiceResponse> {
    try {
      this.logger.log('Starting global trend score update...');
      const client = this.supabaseService.getClient();

      // 1. Fetch all trends
      const { data: trends, error: trendsError } = await client
        .from('trends')
        .select('id, created_at');

      if (trendsError) {
        this.logger.error(`Error fetching trends: ${trendsError.message}`);
        return {
          success: false,
          message: `Error fetching trends: ${trendsError.message}`,
        };
      }

      for (const trend of trends) {
        await this.calculateAndStoreScore(trend.id, trend.created_at);
      }

      this.logger.log('Trend score update complete.');
      return {
        success: true,
        message: messages.UPDATE_SUCCESS,
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }

  async calculateAndStoreScore(trendId: string, createdAt: string): Promise<ServiceResponse> {
    try {
      const client = this.supabaseService.getClient();

      // 2. Fetch engagement count (simple count for now)
      const { count: engagementCount, error: engError } = await client
        .from('engagements')
        .select('*', { count: 'exact', head: true })
        .eq('trend_id', trendId);

      if (engError) {
        this.logger.error(`Error fetching engagements for trend ${trendId}: ${engError.message}`);
        return {
          success: false,
          message: engError.message,
        };
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
        return {
          success: false,
          message: upsertError.message,
        };
      }

      return {
        success: true,
        message: messages.UPDATE_SUCCESS,
        data: { score },
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }
}
