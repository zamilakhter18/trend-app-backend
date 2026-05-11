import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ScoreEvent } from "../db/entities/ScoreEvent.entity";
import { ServiceResponse } from "../common/interfaces/service-response.interface";
import { messages } from "../common/helpers/message";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(ScoreEvent)
    private readonly scoreEventRepository: Repository<ScoreEvent>,
  ) {}

  async getAllScoreEvents(limit: number = 50, page: number = 1): Promise<ServiceResponse> {
    try {
      const skip = (page - 1) * limit;
      const [events, totalItems] = await this.scoreEventRepository.findAndCount({
        relations: ["user", "trend"],
        order: { createdAt: "DESC" },
        take: limit,
        skip: skip,
      });

      return {
        success: true,
        message: messages.FETCH_SUCCESS,
        data: {
          events,
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: page,
        },
      };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }
}
