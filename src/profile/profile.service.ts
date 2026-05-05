import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ProfileService {
  constructor(private supabaseService: SupabaseService) {}

  async getProfile(userId: string) {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('user_profile')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Profile not found');
    }

    return data;
  }
}
