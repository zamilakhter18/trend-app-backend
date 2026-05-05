import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import { messages } from '../common/helpers/message';

@Injectable()
export class TrendService {
  constructor(
    @Inject(DRIZZLE)
    private db: PostgresJsDatabase<typeof schema>,
  ) {}

  async getTrend(id: string): Promise<ServiceResponse> {
    const data = await this.db.query.trends.findFirst({
      where: eq(schema.trends.id, id),
      with: {
        content: true,
        metadata: true,
        products: true,
      },
    });

    if (!data) {
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
