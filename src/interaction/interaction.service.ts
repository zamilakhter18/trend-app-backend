import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan } from "typeorm";
import { Interaction } from "../db/entities/Interaction.entity";
import { Save } from "../db/entities/Save.entity";
import { Clickout } from "../db/entities/Clickout.entity";
import { InteractDto } from "./dto/interact.dto";
import { SaveDto } from "./dto/save.dto";
import { ClickDto } from "./dto/click.dto";
import { ServiceResponse } from "../common/interfaces/service-response.interface";
import { messages } from "../common/helpers/message";
import { InteractionSourceTypeEnum, InteractionTypeEnum } from "../common/helpers/enum";

@Injectable()
export class InteractionService {
  constructor(
    @InjectRepository(Interaction)
    private readonly interactionRepository: Repository<Interaction>,
    @InjectRepository(Save)
    private readonly saveRepository: Repository<Save>,
    @InjectRepository(Clickout)
    private readonly clickoutRepository: Repository<Clickout>,
  ) {}

  async interact(userId: string | null, interactDto: InteractDto): Promise<ServiceResponse> {
    try {
      // Inflation Protection: prevent duplicate VIEW/SHARE from same user/IP within short window (1 hour)
      if (interactDto.interaction_type === InteractionTypeEnum.VIEW || interactDto.interaction_type === InteractionTypeEnum.SHARE) {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const existing = await this.interactionRepository.findOne({
          where: {
            userId: userId || undefined,
            trendId: interactDto.trend_id || undefined,
            productId: interactDto.product_id || undefined,
            interactionType: interactDto.interaction_type,
            createdAt: MoreThan(oneHourAgo),
          },
        });

        if (existing) {
          return { success: true, message: "Interaction already recorded (deduplicated)", data: existing };
        }
      }

      const interaction = this.interactionRepository.create({
        userId,
        trendId: interactDto.trend_id || null,
        productId: interactDto.product_id || null,
        interactionType: interactDto.interaction_type,
        sourceType: interactDto.source_type || null,
        content: interactDto.content || null,
      });
      const data = await this.interactionRepository.save(interaction);

      return { success: true, message: messages.CREATE_SUCCESS, data };
    } catch (error) {
      const err = error as Error;
      return { success: false, message: err.message };
    }
  }

  async save(userId: string, saveDto: SaveDto): Promise<ServiceResponse> {
    try {
      // Fake Save Protection: prevent duplicate saves for the same item
      const existingSave = await this.saveRepository.findOne({
        where: {
          userId,
          trendId: saveDto.trend_id || undefined,
          productId: saveDto.product_id || undefined,
        },
      });

      if (existingSave) {
        return { success: true, message: "Already saved", data: existingSave };
      }

      const saveEntry = this.saveRepository.create({
        userId,
        trendId: saveDto.trend_id || null,
        productId: saveDto.product_id || null,
      });
      const data = await this.saveRepository.save(saveEntry);

      // Also log as an interaction
      await this.interact(userId, {
        trend_id: saveDto.trend_id,
        product_id: saveDto.product_id,
        interaction_type: InteractionTypeEnum.SAVE,
        source_type: InteractionSourceTypeEnum.SYSTEM,
      });

      return { success: true, message: messages.CREATE_SUCCESS, data };
    } catch (error) {
      const err = error as Error;
      return { success: false, message: err.message };
    }
  }

  async getSaves(userId: string): Promise<ServiceResponse> {
    try {
      const saves = await this.saveRepository.find({
        where: { userId },
        relations: ["trend", "product"],
      });
      return { success: true, message: messages.FETCH_SUCCESS, data: saves };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  async deleteSaveById(userId: string, saveId: string): Promise<ServiceResponse> {
    try {
      const result = await this.saveRepository.delete({ id: saveId, userId });
      if (result.affected === 0) {
        return { success: false, message: messages.NOT_FOUND };
      }
      return { success: true, message: messages.DELETE_SUCCESS };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  async unsave(userId: string, target: { trendId?: string; productId?: string }): Promise<ServiceResponse> {
    try {
      await this.saveRepository.delete({ userId, ...target });
      return { success: true, message: messages.DELETE_SUCCESS };
    } catch (error) {
      const err = error as Error;
      return { success: false, message: err.message };
    }
  }

  async trackClick(userId: string | null, clickDto: ClickDto, ipHash?: string): Promise<ServiceResponse> {
    try {
      // Basic deduplication: check if same user/product or IP/product click exists in last 5 minutes
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

      const where: any = {
        productId: clickDto.product_id,
        createdAt: MoreThan(fiveMinutesAgo),
      };

      if (userId) {
        where.userId = userId;
      } else if (ipHash) {
        where.ipHash = ipHash;
      }

      const existingClick = await this.clickoutRepository.findOne({ where });

      if (existingClick) {
        return {
          success: true,
          message: "Click already tracked (deduplicated)",
          data: existingClick,
        };
      }

      const clickout = this.clickoutRepository.create({
        userId,
        productId: clickDto.product_id,
        trendId: clickDto.trend_id || null,
        campaignId: clickDto.campaign_id || null,
        sourceType: clickDto.source_type,
        creatorId: clickDto.creator_id || null,
        sessionId: clickDto.session_id || null,
        ipHash: ipHash || null,
      });
      const data = await this.clickoutRepository.save(clickout);

      // Also log as an interaction
      await this.interact(userId, {
        trend_id: clickDto.trend_id,
        product_id: clickDto.product_id,
        interaction_type: InteractionTypeEnum.CLICK,
        source_type: clickDto.source_type as unknown as InteractionSourceTypeEnum,
      });

      return { success: true, message: messages.CREATE_SUCCESS, data };
    } catch (error) {
      const err = error as Error;
      return { success: false, message: err.message };
    }
  }
}
