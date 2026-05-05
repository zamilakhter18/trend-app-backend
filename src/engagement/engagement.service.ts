import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';
import { and, eq } from 'drizzle-orm';
import { EngageDto } from './dto/engage.dto';
import { SaveDto } from './dto/save.dto';
import { ClickDto } from './dto/click.dto';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import { messages } from '../common/helpers/message';

@Injectable()
export class EngagementService {
  constructor(
    @Inject(DRIZZLE)
    private db: PostgresJsDatabase<typeof schema>,
  ) {}

  async engage(userId: string, engageDto: EngageDto): Promise<ServiceResponse> {
    try {
      const [data] = await this.db
        .insert(schema.engagements)
        .values({
          userId: userId,
          trendId: engageDto.trend_id,
          type: engageDto.type,
          content: engageDto.content,
        })
        .returning();

      return { success: true, message: messages.UPDATE_SUCCESS, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async save(userId: string, saveDto: SaveDto): Promise<ServiceResponse> {
    try {
      const [data] = await this.db
        .insert(schema.saves)
        .values({
          userId: userId,
          trendId: saveDto.trend_id,
        })
        .returning();

      return { success: true, message: messages.CREATE_SUCCESS, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async unsave(userId: string, trendId: string): Promise<ServiceResponse> {
    try {
      await this.db
        .delete(schema.saves)
        .where(
          and(
            eq(schema.saves.userId, userId),
            eq(schema.saves.trendId, trendId),
          ),
        );

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
      const [data] = await this.db
        .insert(schema.clickouts)
        .values({
          userId: userId,
          productId: clickDto.product_id,
        })
        .returning();

      return { success: true, message: messages.CREATE_SUCCESS, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
