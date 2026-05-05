import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AiService {
  constructor(private supabaseService: SupabaseService) {}

  async getTrendExplanation(trendId: string) {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('ai_analysis')
      .select('*')
      .eq('trend_id', trendId)
      .single();

    if (error || !data) {
      // If not found, maybe trigger an enrichment job in the future
      throw new NotFoundException('AI analysis not found for this trend');
    }

    return data;
  }
}
