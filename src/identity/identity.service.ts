import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';
import { desc, eq } from 'drizzle-orm';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import { messages } from '../common/helpers/message';

@Injectable()
export class IdentityService {
  constructor(
    @Inject(DRIZZLE)
    private db: PostgresJsDatabase<typeof schema>,
  ) {}

  async getUserPerformance(userId: string): Promise<ServiceResponse> {
    const data = await this.db.query.userProfile.findFirst({
      columns: {
        trendScore: true,
        level: true,
        badges: true,
      },
      where: eq(schema.userProfile.userId, userId),
    });

    if (!data) {
      return {
        success: false,
        message: messages.NOT_FOUND,
      };
    }

    return { success: true, message: messages.FETCH_SUCCESS, data };
  }

  async getLeaderboard(limit: number = 10): Promise<ServiceResponse> {
    const data = await this.db.query.userProfile.findMany({
      columns: {
        userId: true,
        username: true,
        fullName: true,
        avatarUrl: true,
        trendScore: true,
        level: true,
      },
      orderBy: [desc(schema.userProfile.trendScore)],
      limit: limit,
    });

    return { success: true, message: messages.FETCH_SUCCESS, data };
  }
}
