import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Trend } from "../db/entities/Trend.entity";
import { ServiceResponse } from "../common/interfaces/service-response.interface";
import { messages } from "../common/helpers/message";
import { SponsoredContentService } from "../sponsored-content/sponsored-content.service";
import { TrendStatusEnum, TrendContentTypeEnum } from "../common/helpers/enum";

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Trend)
    private readonly trendRepository: Repository<Trend>,
    private readonly sponsoredService: SponsoredContentService,
  ) {}

  /**
   * Fetches the trend feed ordered by the advanced ranking algorithm
   * and merges sponsored content at specific intervals.
   *
   * @param limit Number of items to fetch
   * @param cursor Pagination cursor (base64 encoded)
   */
  async getFeed(limit: number = 10, cursor?: string): Promise<ServiceResponse<any>> {
    try {
      const query = this.trendRepository
        .createQueryBuilder("trend")
        .innerJoinAndSelect("trend.score", "score") // Advanced scores
        .leftJoinAndSelect("trend.contents", "contents")
        .leftJoinAndSelect("trend.creator", "creator")
        .leftJoinAndSelect("trend.sponsoredContent", "sponsored") // Check if it's sponsored
        .where("trend.status = :status", { status: TrendStatusEnum.PUBLISHED })
        .andWhere("trend.contentType = :contentType", { contentType: TrendContentTypeEnum.ORGANIC })
        .take(limit)
        .orderBy("score.finalScore", "DESC") // Main ranking metric
        .addOrderBy("trend.createdAt", "DESC");

      // Pagination logic using cursor
      if (cursor) {
        const [scoreStr, createdAtStr] = Buffer.from(cursor, "base64").toString().split("|");
        const score = parseFloat(scoreStr);
        const createdAt = createdAtStr;

        query.andWhere("(score.finalScore < :score OR (score.finalScore = :score AND trend.createdAt < :createdAt))", { score, createdAt });
      }

      const rawTrends = await query.getMany();

      // 1. Fetch top-priority sponsored content to inject
      const sponsoredResult = await this.sponsoredService.getSponsoredFeed(2);
      const sponsoredTrends = (sponsoredResult.data?.data || []).map((s: any) => ({
        ...s.trend,
        isSponsored: true,
        campaignName: s.campaignName,
      }));

      // 2. Intelligent Merge Logic
      // We inject sponsored items every 5th position
      const finalFeed: any[] = [];
      let sponsoredIndex = 0;

      rawTrends.forEach((trend, index) => {
        finalFeed.push(trend);

        // Inject every 5 items if we have sponsored content left
        if ((index + 1) % 5 === 0 && sponsoredIndex < sponsoredTrends.length) {
          // Avoid duplicate if the trend is already in the main feed
          const sponsored = sponsoredTrends[sponsoredIndex];
          if (!finalFeed.find((f) => f.id === sponsored.id)) {
            finalFeed.push(sponsored);
            sponsoredIndex++;
          }
        }
      });

      // Generate next cursor
      let nextCursor = null;
      if (rawTrends.length === limit) {
        const lastItem = rawTrends[rawTrends.length - 1];
        const lastScore = lastItem.score?.finalScore || 0;
        const lastCreatedAt = lastItem.createdAt?.toISOString();
        nextCursor = Buffer.from(`${lastScore}|${lastCreatedAt}`).toString("base64");
      }

      return {
        success: true,
        message: messages.FETCH_SUCCESS,
        data: {
          data: finalFeed,
          nextCursor,
        },
      };
    } catch (error) {
      const err = error as Error;
      return { success: false, message: err.message };
    }
  }
}
