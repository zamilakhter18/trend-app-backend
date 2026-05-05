import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ): Promise<ServiceResponse> {
    try {
      const clickout = this.clickoutRepository.create({
        userId,
        productId: clickDto.product_id,
      });
      const data = await this.clickoutRepository.save(clickout);

      return { success: true, message: messages.CREATE_SUCCESS, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
