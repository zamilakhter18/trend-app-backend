import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class TrendService {
  constructor(private supabaseService: SupabaseService) {}

  async getTrend(id: string) {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('trends')
      .select(`
        *,
        trend_content(*),
        trend_metadata(*),
        products(*)
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException('Trend not found');
    }

    return data;
  }
}
