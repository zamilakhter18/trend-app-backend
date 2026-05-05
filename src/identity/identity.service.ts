import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import { messages } from '../common/helpers/message';

@Injectable()
export class IdentityService {
  constructor(private supabaseService: SupabaseService) {}

  async getUserPerformance(userId: string): Promise<ServiceResponse> {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('user_profile')
      .select('trend_score, level, badges')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return {
        success: false,
        message: error?.message || messages.NOT_FOUND,
      };
    }

    return { success: true, message: messages.FETCH_SUCCESS, data };
  }

  async getLeaderboard(limit: number = 10): Promise<ServiceResponse> {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('user_profile')
      .select('user_id, username, full_name, avatar_url, trend_score, level')
      .order('trend_score', { ascending: false })
      .limit(limit);

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: messages.FETCH_SUCCESS, data };
  }
}
