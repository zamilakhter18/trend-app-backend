import { Injectable, Logger, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { SponsoredContent } from "../db/entities/SponsoredContent.entity";
import { Trend } from "../db/entities/Trend.entity";
import { Brand } from "../db/entities/Brand.entity";
import { CreateSponsoredContentDto } from "./dto/create-sponsored-content.dto";
import { UpdateSponsoredContentDto } from "./dto/update-sponsored-content.dto";
import { ServiceResponse } from "../common/interfaces/service-response.interface";
import { messages } from "../common/helpers/message";

@Injectable()
export class SponsoredContentService {
  private readonly logger = new Logger(SponsoredContentService.name);

  constructor(
    @InjectRepository(SponsoredContent)
    private sponsoredRepository: Repository<SponsoredContent>,
    @InjectRepository(Trend)
    private trendRepository: Repository<Trend>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  /**
   * Creates a new sponsored content campaign
   */
  async create(dto: CreateSponsoredContentDto): Promise<ServiceResponse> {
    try {
      // 1. Validate trend exists
      const trend = await this.trendRepository.findOne({ where: { id: dto.trend_id } });
      if (!trend) {
        throw new NotFoundException("Trend not found");
      }

      // 2. Validate brand exists
      const brand = await this.brandRepository.findOne({ where: { id: dto.brand_id } });
      if (!brand) {
        throw new NotFoundException("Brand not found");
      }

      // 3. Check for existing active campaign for this trend
      const existing = await this.sponsoredRepository.findOne({ where: { trendId: dto.trend_id, isActive: true } });
      if (existing) {
        throw new BadRequestException("Active campaign already exists for this trend");
      }

      // 4. Create entry
      const sponsored = this.sponsoredRepository.create({
        trendId: dto.trend_id,
        brandId: dto.brand_id,
        sponsorName: dto.sponsor_name || brand.name,
        campaignName: dto.campaign_name,
        budget: dto.budget,
        placementBid: dto.placement_bid,
        campaignPriority: dto.campaign_priority,
        startsAt: new Date(dto.start_date),
        endsAt: new Date(dto.end_date),
        isActive: true,
      });

      const saved = await this.sponsoredRepository.save(sponsored);

      return {
        success: true,
        message: messages.CREATE_SUCCESS,
        data: saved,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  /**
   * Returns active sponsored campaigns sorted by campaign priority
   */
  async getSponsoredFeed(limit: number = 5, offset: number = 0): Promise<ServiceResponse> {
    try {
      const now = new Date();
      const [data, total] = await this.sponsoredRepository.findAndCount({
        where: {
          isActive: true,
          startsAt: LessThanOrEqual(now),
          endsAt: MoreThanOrEqual(now),
        },
        relations: ["trend", "trend.contents", "trend.score", "brand"],
        order: { campaignPriority: "DESC" },
        take: limit,
        skip: offset,
      });

      return {
        success: true,
        message: messages.FETCH_SUCCESS,
        data: { data, total },
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  /**
   * Updates an existing campaign
   */
  async update(trendId: string, dto: UpdateSponsoredContentDto): Promise<ServiceResponse> {
    try {
      const sponsored = await this.sponsoredRepository.findOne({ where: { trendId } });
      if (!sponsored) {
        throw new NotFoundException("Sponsored content not found");
      }

      if (dto.brand_id) {
        const brand = await this.brandRepository.findOne({ where: { id: dto.brand_id } });
        if (!brand) throw new NotFoundException("Brand not found");
        sponsored.brandId = dto.brand_id;
      }
      if (dto.sponsor_name) sponsored.sponsorName = dto.sponsor_name;
      if (dto.campaign_name) sponsored.campaignName = dto.campaign_name;
      if (dto.budget !== undefined) sponsored.budget = dto.budget;
      if (dto.placement_bid !== undefined) sponsored.placementBid = dto.placement_bid;
      if (dto.campaign_priority !== undefined) sponsored.campaignPriority = dto.campaign_priority;
      if (dto.start_date) sponsored.startsAt = new Date(dto.start_date);
      if (dto.end_date) sponsored.endsAt = new Date(dto.end_date);
      if (dto.is_active !== undefined) sponsored.isActive = dto.is_active;

      const updated = await this.sponsoredRepository.save(sponsored);

      return {
        success: true,
        message: messages.UPDATE_SUCCESS,
        data: updated,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  /**
   * Deletes (Hard Delete) a campaign
   */
  async remove(trendId: string): Promise<ServiceResponse> {
    try {
      const result = await this.sponsoredRepository.delete({ trendId });
      if (result.affected === 0) {
        throw new NotFoundException("Sponsored content not found");
      }
      return {
        success: true,
        message: messages.DELETE_SUCCESS,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
