import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DiscountService } from "./discount.service";
import { DiscountController } from "./discount.controller";
import { DiscountCode } from "../db/entities/DiscountCode.entity";
import { CommonModule } from "../common/common.module";

@Module({
  imports: [TypeOrmModule.forFeature([DiscountCode]), CommonModule],
  providers: [DiscountService],
  controllers: [DiscountController],
})
export class DiscountModule {}
