import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { EngageDto } from './dto/engage.dto';
import { SaveDto } from './dto/save.dto';
import { ClickDto } from './dto/click.dto';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import { messages } from '../common/helpers/message';

@Injectable()
export class EngagementService {
  constructor(private supabaseService: SupabaseService) {}

  async engage(userId: string, engageDto: EngageDto): Promise<ServiceResponse> {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('engagements')
      .insert({
        user_id: userId,
        trend_id: engageDto.trend_id,
        type: engageDto.type,
        content: engageDto.content,
      })
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: messages.UPDATE_SUCCESS, data };
  }

  async save(userId: string, saveDto: SaveDto): Promise<ServiceResponse> {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('saves')
      .insert({
        user_id: userId,
        trend_id: saveDto.trend_id,
      })
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: messages.CREATE_SUCCESS, data };
  }

  async unsave(userId: string, trendId: string): Promise<ServiceResponse> {
    const client = this.supabaseService.getClient();

    const { error } = await client
      .from('saves')
      .delete()
      .match({ user_id: userId, trend_id: trendId });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: messages.DELETE_SUCCESS };
  }

  async trackClick(
    userId: string | null,
    clickDto: ClickDto,
  ): Promise<ServiceResponse> {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('clickouts')
      .insert({
        user_id: userId,
        product_id: clickDto.product_id,
      })
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: messages.CREATE_SUCCESS, data };
  }
}
