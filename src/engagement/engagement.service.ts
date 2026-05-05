import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { EngageDto } from './dto/engage.dto';
import { SaveDto } from './dto/save.dto';
import { ClickDto } from './dto/click.dto';

@Injectable()
export class EngagementService {
  constructor(private supabaseService: SupabaseService) {}

  async engage(userId: string, engageDto: EngageDto) {
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
      throw new BadRequestException(error.message);
    }

    return data;
  }

  async save(userId: string, saveDto: SaveDto) {
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
      throw new BadRequestException(error.message);
    }

    return data;
  }

  async unsave(userId: string, trendId: string) {
    const client = this.supabaseService.getClient();

    const { error } = await client
      .from('saves')
      .delete()
      .match({ user_id: userId, trend_id: trendId });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return { success: true };
  }

  async trackClick(userId: string | null, clickDto: ClickDto) {
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
      throw new BadRequestException(error.message);
    }

    return data;
  }
}
