import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trend } from '../db/entities/Trend.entity';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import { messages } from '../common/helpers/message';

@Injectable()
export class TrendService {
  constructor(
    @InjectRepository(Trend)
    private readonly trendRepository: Repository<Trend>,
  ) {}

  async getTrend(id: string): Promise<ServiceResponse> {
    const data = await this.trendRepository.findOne({
      where: { id },
      relations: ['contents', 'metadata', 'products'],
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
