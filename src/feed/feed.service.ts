import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import { messages } from '../common/helpers/message';

@Injectable()
export class FeedService {
  constructor(private supabaseService: SupabaseService) {}

  async getFeed(
    limit: number = 10,
    cursor?: string,
  ): Promise<ServiceResponse<any>> {
    const client = this.supabaseService.getClient();

    let query = client
      .from('trends')
      .select(
        `
        *,
        trend_scores!inner(score),
        trend_content(*)
      `,
      )
      .order('score', { referencedTable: 'trend_scores', ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (cursor) {
      const [score, createdAt] = Buffer.from(cursor, 'base64')
        .toString()
        .split('|');
      query = query.or(
        `score.lt.${score},and(score.eq.${score},created_at.lt.${createdAt})`,
        { referencedTable: 'trend_scores' as any },
      );
    }

    const { data, error } = await query;

    if (error) {
      return { success: false, message: error.message };
    }

    let nextCursor = null;
    if (data.length === limit) {
      const lastItem = data[data.length - 1];
      const score = (lastItem as any).trend_scores[0]?.score || 0;
      const createdAt = lastItem.created_at;
      nextCursor = Buffer.from(`${score}|${createdAt}`).toString('base64');
    }

    return {
      success: true,
      message: messages.FETCH_SUCCESS,
      data: {
        data,
        nextCursor,
      },
    };
  }
}
