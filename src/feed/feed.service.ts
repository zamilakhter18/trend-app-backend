import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trend } from '../db/entities/Trend.entity';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import { messages } from '../common/helpers/message';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Trend)
    private readonly trendRepository: Repository<Trend>,
  ) {}

  async getFeed(
    limit: number = 10,
    cursor?: string,
  ): Promise<ServiceResponse<any>> {
    try {
      const query = this.trendRepository
        .createQueryBuilder('trend')
        .innerJoinAndSelect('trend.score', 'score')
        .leftJoinAndSelect('trend.contents', 'contents')
        .take(limit)
        .orderBy('score.score', 'DESC')
        .addOrderBy('trend.createdAt', 'DESC');

      if (cursor) {
        const [scoreStr, createdAtStr] = Buffer.from(cursor, 'base64')
          .toString()
          .split('|');
        const score = parseFloat(scoreStr);
        const createdAt = createdAtStr;

        query.where(
          '(score.score < :score OR (score.score = :score AND trend.createdAt < :createdAt))',
          { score, createdAt },
        );
      }

      const data = await query.getMany();

      let nextCursor = null;
      if (data.length === limit) {
        const lastItem = data[data.length - 1];
        const lastScore = lastItem.score?.score || 0;
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
