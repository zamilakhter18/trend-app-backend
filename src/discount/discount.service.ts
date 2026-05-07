import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan, IsNull } from "typeorm";
import { DiscountCode } from "../db/entities/DiscountCode.entity";
import { ServiceResponse } from "../common/interfaces/service-response.interface";
import { messages } from "../common/helpers/message";

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(DiscountCode)
    private readonly discountRepository: Repository<DiscountCode>,
  ) {}

  async findAllAvailable(userScore: number = 0): Promise<ServiceResponse> {
    try {
      const now = new Date();
      const discounts = await this.discountRepository.find({
        where: [
          {
            minScoreRequired: MoreThan(userScore), // User can see what they could unlock
            expiresAt: MoreThan(now),
          },
          {
            minScoreRequired: MoreThan(userScore),
            expiresAt: IsNull(),
          },
          {
            minScoreRequired: userScore, // Exact match
            expiresAt: MoreThan(now),
          },
          {
            minScoreRequired: userScore,
            expiresAt: IsNull(),
          },
        ],
        relations: ["brand"],
      });

      // Actually, user probably wants to see discounts they ALREADY qualified for or ALL of them.
      // Let's just return all active ones and let frontend filter.
      const allActive = await this.discountRepository.find({
        where: [{ expiresAt: MoreThan(now) }, { expiresAt: IsNull() }],
        relations: ["brand"],
      });

      return { success: true, message: messages.FETCH_SUCCESS, data: allActive };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }
}
