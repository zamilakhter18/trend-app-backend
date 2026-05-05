import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class IdentityService {
  constructor(private supabaseService: SupabaseService) {}

  async getUserPerformance(userId: string) {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('user_profile')
      .select('trend_score, level, badges')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw new NotFoundException('User identity not found');
    }

    return data;
  }

  async getLeaderboard(limit: number = 10) {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('user_profile')
      .select('user_id, username, full_name, avatar_url, trend_score, level')
      .order('trend_score', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}
