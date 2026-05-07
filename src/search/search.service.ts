import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, ILike } from "typeorm";
import { Trend } from "../db/entities/Trend.entity";
import { Product } from "../db/entities/Product.entity";

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Trend)
    private trendRepository: Repository<Trend>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async search(query: string) {
    const [trends, products] = await Promise.all([
      this.trendRepository.find({
        where: [{ title: ILike(`%${query}%`) }, { description: ILike(`%${query}%`) }],
        take: 10,
      }),
      this.productRepository.find({
        where: [{ name: ILike(`%${query}%`) }, { description: ILike(`%${query}%`) }],
        take: 10,
      }),
    ]);

    return { trends, products };
  }
}
