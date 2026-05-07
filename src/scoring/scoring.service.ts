import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan } from "typeorm";
import { Cron } from "@nestjs/schedule";
import { Trend } from "../db/entities/Trend.entity";
import { TrendScore } from "../db/entities/TrendScore.entity";
import { Interaction } from "../db/entities/Interaction.entity";
import { Save } from "../db/entities/Save.entity";
import { Clickout } from "../db/entities/Clickout.entity";

@Injectable()
export class ScoringService {
  private readonly logger = new Logger(ScoringService.name);

  constructor(
    @InjectRepository(Trend)
    private trendRepository: Repository<Trend>,
    @InjectRepository(TrendScore)
    private trendScoreRepository: Repository<TrendScore>,
    @InjectRepository(Interaction)
    private interactionRepository: Repository<Interaction>,
    @InjectRepository(Save)
    private saveRepository: Repository<Save>,
    @InjectRepository(Clickout)
    private clickoutRepository: Repository<Clickout>,
  ) {}

  /**
   * Periodic task to update all active trend scores.
   * Runs every 15 minutes.
   */
  @Cron("0 */15 * * * *")
  async handlePeriodicScoringUpdate() {
    this.logger.log("Starting periodic trend scoring update...");
    const trends = await this.trendRepository.find({
      where: { status: "PUBLISHED" },
      select: ["id"],
    });

    for (const trend of trends) {
      await this.calculateTrendScore(trend.id);
    }
    this.logger.log(`Updated scores for ${trends.length} trends.`);
  }

  /**
   * Recalculate scores for a specific trend.
   */
  async calculateTrendScore(trendId: string): Promise<void> {
    const trend = await this.trendRepository.findOne({
      where: { id: trendId },
    });

    if (!trend) return;

    const totalInteractions = await this.interactionRepository.count({ where: { trendId } });
    const totalSaves = await this.saveRepository.count({ where: { trendId } });
    const totalClicks = await this.clickoutRepository.count({ where: { trendId } });

    // Recent interaction for velocity (last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentInteractions = await this.interactionRepository.count({
      where: {
        trendId,
        createdAt: MoreThan(twentyFourHoursAgo),
      },
    });

    const velocity = this.calculateVelocity(recentInteractions);
    const saveRate = this.calculateSaveRate(totalSaves, totalInteractions);
    const ctr = this.calculateCTR(totalClicks, totalInteractions);

    const baseScore = this.computeBaseScore(velocity, saveRate, ctr);
    const timeDecayFactor = this.calculateTimeDecay(trend.createdAt);
    const finalScore = baseScore * timeDecayFactor;

    await this.trendScoreRepository.save({
      trendId,
      score: baseScore,
      finalScore: finalScore,
      velocity,
      saveRateScore: saveRate,
      ctrScore: ctr,
      engagementCount: totalInteractions,
      lastUpdated: new Date(),
      calculatedAt: new Date(),
    });
  }

  private calculateVelocity(recentInteractions: number): number {
    // Interactions per hour in the last 24h
    return recentInteractions / 24;
  }

  private calculateSaveRate(saves: number, interactions: number): number {
    if (interactions === 0) return 0;
    return (saves / interactions) * 100; // Percentage based
  }

  private calculateCTR(clicks: number, interactions: number): number {
    if (interactions === 0 && clicks === 0) return 0;
    // CTR relative to total interactions (including views)
    return (clicks / interactions) * 100;
  }

  private computeBaseScore(velocity: number, saveRate: number, ctr: number): number {
    // Weights: 40% velocity, 30% saveRate, 30% CTR
    return velocity * 0.4 + saveRate * 0.3 + ctr * 0.3;
  }

  private calculateTimeDecay(createdAt: Date): number {
    const hoursOld = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    // Gravity factor (higher = faster decay)
    const gravity = 1.8;
    return 1 / Math.pow(hoursOld + 2, gravity);
  }
}
