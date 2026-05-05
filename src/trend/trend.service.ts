import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import { messages } from '../common/helpers/message';

@Injectable()
export class TrendService {
  constructor(private supabaseService: SupabaseService) {}

  async getTrend(id: string): Promise<ServiceResponse> {
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
