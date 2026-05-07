import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Engagement } from '../db/entities/Engagement.entity';
import { Save } from '../db/entities/Save.entity';
import { Clickout } from '../db/entities/Clickout.entity';
import { EngageDto } from './dto/engage.dto';
import { SaveDto } from './dto/save.dto';
import { ClickDto } from './dto/click.dto';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import { messages } from '../common/helpers/message';

@Injectable()
export class EngagementService {
  constructor(
    @InjectRepository(Engagement)
    private readonly engagementRepository: Repository<Engagement>,
    @InjectRepository(Save)
    private readonly saveRepository: Repository<Save>,
    @InjectRepository(Clickout)
    private readonly clickoutRepository: Repository<Clickout>,
  ) {}

  async engage(userId: string, engageDto: EngageDto): Promise<ServiceResponse> {
    try {
      const engagement = this.engagementRepository.create({
        userId,
        trendId: engageDto.trend_id,
        type: engageDto.type,
        content: engageDto.content,
      });
      const data = await this.engagementRepository.save(engagement);

      return { success: true, message: messages.UPDATE_SUCCESS, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async save(userId: string, saveDto: SaveDto): Promise<ServiceResponse> {
    try {
      const saveEntry = this.saveRepository.create({
        userId,
        trendId: saveDto.trend_id,
      });
      const data = await this.saveRepository.save(saveEntry);

      return { success: true, message: messages.CREATE_SUCCESS, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async unsave(userId: string, trendId: string): Promise<ServiceResponse> {
    try {
      await this.saveRepository.delete({ userId, trendId });
      return { success: true, message: messages.DELETE_SUCCESS };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async trackClick(
    userId: string | null,
    clickDto: ClickDto,
    ipHash?: string,
  ): Promise<ServiceResponse> {
    try {
      // Basic deduplication: check if same user/product or IP/product click exists in last 5 minutes
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      
      const where: any = {
        productId: clickDto.product_id,
        createdAt: MoreThan(fiveMinutesAgo),
      };

      if (userId) {
        where.userId = userId;
      } else if (ipHash) {
        where.ipHash = ipHash;
      }

      const existingClick = await this.clickoutRepository.findOne({ where });

      if (existingClick) {
        return { 
          success: true, 
          message: 'Click already tracked (deduplicated)', 
          data: existingClick 
        };
      }

      const clickout = this.clickoutRepository.create({
        userId,
        productId: clickDto.product_id,
        trendId: clickDto.trend_id,
        campaignId: clickDto.campaign_id,
        sourceType: clickDto.source_type,
        creatorId: clickDto.creator_id,
        sessionId: clickDto.session_id,
        ipHash,
      });
      const data = await this.clickoutRepository.save(clickout);

      return { success: true, message: messages.CREATE_SUCCESS, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
