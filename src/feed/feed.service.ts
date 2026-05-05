import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class FeedService {
  constructor(private supabaseService: SupabaseService) {}

  async getFeed(limit: number = 10, cursor?: string) {
    const client = this.supabaseService.getClient();

    let query = client
      .from('trends')
      .select(`
        *,
        trend_scores!inner(score),
        trend_content(*)
      `)
      .order('score', { referencedTable: 'trend_scores', ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (cursor) {
      // Simple cursor implementation: expecting score|id or similar
      const [score, createdAt] = Buffer.from(cursor, 'base64').toString().split('|');
      // This is a simplified version of the logic
      query = query.or(`score.lt.${score},and(score.eq.${score},created_at.lt.${createdAt})`, { referencedTable: 'trend_scores' as any });
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    // Generate next cursor
    let nextCursor = null;
    if (data.length === limit) {
      const lastItem = data[data.length - 1];
      const score = (lastItem as any).trend_scores[0]?.score || 0;
      const createdAt = lastItem.created_at;
      nextCursor = Buffer.from(`${score}|${createdAt}`).toString('base64');
    }

    return {
      data,
      nextCursor,
    };
  }
}
