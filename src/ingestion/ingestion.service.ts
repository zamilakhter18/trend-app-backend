import { Injectable, Logger, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Trend } from '../db/entities/Trend.entity';
import { TrendMetadata } from '../db/entities/TrendMetadata.entity';
import { TrendScore } from '../db/entities/TrendScore.entity';
import { TrendContent } from '../db/entities/TrendContent.entity';
import { SocialImportDto } from './dto/social-import.dto';
import { IngestionRunDto } from './dto/ingestion-run.dto';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import { messages } from '../common/helpers/message';

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    private configService: ConfigService,
    private dataSource: DataSource,
    @InjectRepository(Trend)
    private trendRepository: Repository<Trend>,
    @InjectRepository(TrendMetadata)
    private metadataRepository: Repository<TrendMetadata>,
    @InjectRepository(TrendScore)
    private scoreRepository: Repository<TrendScore>,
  ) {}

  /**
   * Validates the internal ingestion API token
   */
  validateToken(token: string): boolean {
    const internalToken = this.configService.get<string>('INGESTION_API_TOKEN');
    if (!internalToken || token !== internalToken) {
      throw new UnauthorizedException('Invalid ingestion token');
    }
    return true;
  }

  /**
   * Imports a trend from a social source
   */
  async importSocialTrend(dto: SocialImportDto): Promise<ServiceResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Check for duplicates
      const existing = await this.trendRepository.findOne({
        where: { source: dto.source, externalId: dto.external_id },
      });

      if (existing) {
        throw new BadRequestException('Trend already exists');
      }

      // 2. Create Trend
      const trend = queryRunner.manager.create(Trend, {
        title: dto.title,
        description: dto.description,
        source: dto.source,
        externalId: dto.external_id,
        phase: 'emerging',
      });
      const savedTrend = await queryRunner.manager.save(trend);

      // 3. Create Trend Content (Media)
      const content = queryRunner.manager.create(TrendContent, {
        trendId: savedTrend.id,
        contentUrl: dto.media_url,
        contentType: dto.media_url.endsWith('.mp4') ? 'video' : 'image',
        isPrimary: true,
      });
      await queryRunner.manager.save(content);

      // 4. Create Metadata
      const metadata = queryRunner.manager.create(TrendMetadata, {
        trendId: savedTrend.id,
        tags: dto.hashtags,
      });
      await queryRunner.manager.save(metadata);

      // 5. Create Score
      const score = queryRunner.manager.create(TrendScore, {
        trendId: savedTrend.id,
        engagementCount: dto.engagement_count,
        velocity: dto.velocity_score,
        score: dto.velocity_score, // Initial score
      });
      await queryRunner.manager.save(score);

      await queryRunner.commitTransaction();

      return {
        success: true,
        message: messages.CREATE_SUCCESS,
        data: savedTrend,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Import failed: ${error.message}`);
      return {
        success: false,
        message: error.message || 'Failed to import trend',
      };
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Triggers the external ingestion pipeline (Placeholder)
   */
  async triggerPipeline(dto: IngestionRunDto): Promise<ServiceResponse> {
    this.logger.log(`Triggering ingestion pipeline for: ${dto.platforms?.join(', ') || 'all'}`);
    
    // In a real scenario, this would call a Webhook on the Python side
    // or push a message to a Task Queue (SQS/Redis)
    
    return {
      success: true,
      message: 'Ingestion pipeline triggered successfully',
    };
  }
}
