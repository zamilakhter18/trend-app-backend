import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';
import { desc, lt, and, eq, or } from 'drizzle-orm';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import { messages } from '../common/helpers/message';

@Injectable()
export class FeedService {
  constructor(
    @Inject(DRIZZLE)
    private db: PostgresJsDatabase<typeof schema>,
  ) {}

  async getFeed(
    limit: number = 10,
    cursor?: string,
  ): Promise<ServiceResponse<any>> {
    try {
      let query = this.db
        .select({
          trend: schema.trends,
          score: schema.trendScores,
        })
        .from(schema.trends)
        .innerJoin(
          schema.trendScores,
          eq(schema.trends.id, schema.trendScores.trendId),
        )
        .limit(limit)
        .orderBy(
          desc(schema.trendScores.score),
          desc(schema.trends.createdAt),
        );

      if (cursor) {
        const [scoreStr, createdAtStr] = Buffer.from(cursor, 'base64')
          .toString()
          .split('|');
        const score = scoreStr;
        const createdAt = new Date(createdAtStr);

        query = query.where(
          or(
            lt(schema.trendScores.score, score),
            and(
              eq(schema.trendScores.score, score),
              lt(schema.trends.createdAt, createdAt),
            ),
          ),
        ) as any;
      }

      const results = await query;

      // Fetch content for each trend (batching would be better, but keeping it simple for now)
      const data = await Promise.all(
        results.map(async (row) => {
          const content = await this.db.query.trendContent.findMany({
            where: eq(schema.trendContent.trendId, row.trend.id),
          });
          return {
            ...row.trend,
            trend_scores: [row.score],
            trend_content: content,
          };
        }),
      );

      let nextCursor = null;
      if (data.length === limit) {
        const lastItem = data[data.length - 1];
        const lastScore = (lastItem as any).trend_scores[0]?.score || '0';
        const lastCreatedAt = lastItem.createdAt?.toISOString();
        nextCursor = Buffer.from(`${lastScore}|${lastCreatedAt}`).toString('base64');
      }

      return {
        success: true,
        message: messages.FETCH_SUCCESS,
        data: {
          data,
          nextCursor,
        },
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
