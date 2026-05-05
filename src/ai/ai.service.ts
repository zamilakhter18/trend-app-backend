import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import { messages } from '../common/helpers/message';

@Injectable()
export class AiService {
  constructor(private supabaseService: SupabaseService) {}

  async getTrendExplanation(trendId: string): Promise<ServiceResponse> {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('ai_analysis')
      .select('*')
      .eq('trend_id', trendId)
      .single();

    if (error || !data) {
      return {
        success: false,
        message: messages.NOT_FOUND,
      };
    }

    return {
      success: true,
      message: messages.FETCH_SUCCESS,
      data,
    };
  }
}
