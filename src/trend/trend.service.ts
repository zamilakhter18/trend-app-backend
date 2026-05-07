import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Trend } from "../db/entities/Trend.entity";
import { ServiceResponse } from "../common/interfaces/service-response.interface";
import { messages } from "../common/helpers/message";

@Injectable()
export class TrendService {
  constructor(
    @InjectRepository(Trend)
    private readonly trendRepository: Repository<Trend>,
  ) {}

  async getTrend(id: string): Promise<ServiceResponse> {
    const data = await this.trendRepository.findOne({
      where: { id },
      relations: ["contents", "metadata", "products"],
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

  async createTrend(creatorId: string, trendData: any): Promise<ServiceResponse> {
    try {
      const trend = this.trendRepository.create({
        ...trendData,
        creatorId,
      });
      const savedTrend = await this.trendRepository.save(trend);
      return { success: true, message: messages.CREATE_SUCCESS, data: savedTrend };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  async updateTrend(id: string, updateData: any): Promise<ServiceResponse> {
    try {
      const trend = await this.trendRepository.findOne({ where: { id } });
      if (!trend) {
        return { success: false, message: messages.NOT_FOUND };
      }
      Object.assign(trend, updateData);
      const updatedTrend = await this.trendRepository.save(trend);
      return { success: true, message: messages.UPDATE_SUCCESS, data: updatedTrend };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }
}
