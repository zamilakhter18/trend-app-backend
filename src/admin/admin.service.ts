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

  async getAllScoreEvents(limit: number = 50, offset: number = 0): Promise<ServiceResponse> {
    try {
      const [events, total] = await this.scoreEventRepository.findAndCount({
        relations: ["user", "trend"],
        order: { createdAt: "DESC" },
        take: limit,
        skip: offset,
      });

      return {
        success: true,
        message: messages.FETCH_SUCCESS,
        data: {
          events,
          total,
          limit,
          offset,
        },
      };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }
}
