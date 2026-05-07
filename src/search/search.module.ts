import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";
import { Trend } from "../db/entities/Trend.entity";
import { Product } from "../db/entities/Product.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Trend, Product])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
