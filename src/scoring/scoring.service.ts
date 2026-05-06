import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Trend } from '../db/entities/Trend.entity';
import { TrendScore } from '../db/entities/TrendScore.entity';
import { Engagement } from '../db/entities/Engagement.entity';
import { Save } from '../db/entities/Save.entity';
import { Clickout } from '../db/entities/Clickout.entity';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import { messages } from '../common/helpers/message';

@Injectable()
export class ScoringService {
  private readonly logger = new Logger(ScoringService.name);

  // Weights for the scoring formula
  private readonly WEIGHTS = {
    VELOCITY: 0.5,
    SAVE_RATE: 0.3,
    CTR: 0.2,
    GRAVITY: 1.8,
  };

  constructor(
    @InjectRepository(Trend)
    private trendRepository: Repository<Trend>,
    @InjectRepository(TrendScore)
    private scoreRepository: Repository<TrendScore>,
    @InjectRepository(Engagement)
    private engagementRepository: Repository<Engagement>,
    @InjectRepository(Save)
    private saveRepository: Repository<Save>,
    @InjectRepository(Clickout)
    private clickoutRepository: Repository<Clickout>,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.debug('Starting scheduled global feed refresh...');
    await this.refreshGlobalFeedScores();
  }

  /**
   * Refreshes scores for all active trends
   */
  async refreshGlobalFeedScores(): Promise<ServiceResponse> {
    try {
      const trends = await this.trendRepository.find();
      this.logger.log(`Recalculating scores for ${trends.length} trends...`);

      for (const trend of trends) {
        await this.calculateAndStoreScore(trend);
      }

      return {
        success: true,
        message: 'Global feed scores refreshed',
      };
    } catch (error) {
      this.logger.error(`Global refresh failed: ${error.message}`);
      return { success: false, message: error.message };
    }
  }

  /**
   * Main calculation engine for a single trend
   */
  async calculateAndStoreScore(trend: Trend): Promise<number> {
    const trendId = trend.id;

    // 1. Get raw metrics
    const totalEngagements = await this.engagementRepository.count({ where: { trendId } });
    const totalSaves = await this.saveRepository.count({ where: { trendId } });
    const totalClicks = await this.clickoutRepository.count({
      where: { product: { trendId } },
    });
    
    // Recent engagement for velocity (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentEngagements = await this.engagementRepository.count({
      where: { trendId, createdAt: MoreThan(oneDayAgo) },
    });

    // 2. Calculate component scores
    const velocity = this.calculateVelocity(recentEngagements);
    const saveRate = this.calculateSaveRate(totalSaves, totalEngagements);
    const ctr = this.calculateCTR(totalClicks, totalEngagements);

    // 3. Base Score
    let baseScore = (velocity * this.WEIGHTS.VELOCITY) +
                    (saveRate * this.WEIGHTS.SAVE_RATE) +
                    (ctr * this.WEIGHTS.CTR);

    // 4. Apply Time Decay
    const finalScore = this.applyTimeDecay(baseScore, trend.createdAt);

    // 5. Persist to DB
    await this.scoreRepository.upsert({
      trendId,
      velocity: velocity,
      saveRateScore: saveRate,
      ctrScore: ctr,
      score: baseScore, // Original base score
      finalScore: finalScore,
      engagementCount: totalEngagements,
      calculatedAt: new Date(),
      lastUpdated: new Date(),
    }, ['trendId']);

    return finalScore;
  }

  private calculateVelocity(recentEngagements: number): number {
    // Engagements per hour in the last 24h
    return recentEngagements / 24;
  }

  private calculateSaveRate(saves: number, engagements: number): number {
    if (engagements === 0) return 0;
    return (saves / engagements) * 100; // Percentage based
  }

  private calculateCTR(clicks: number, engagements: number): number {
    if (engagements === 0 && clicks === 0) return 0;
    // Simple CTR: clicks relative to total interaction
    return (clicks / (engagements + clicks)) * 100;
  }

  private applyTimeDecay(score: number, createdAt: Date): number {
    const now = new Date();
    const ageInHours = Math.max(1, (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60));
    
    // Hacker News / Reddit inspired decay: Score / (age + 2)^gravity
    return score / Math.pow(ageInHours + 2, this.WEIGHTS.GRAVITY);
  }
}
