import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { ScoreEvent } from "../db/entities/ScoreEvent.entity";
import { TrendModule } from "../trend/trend.module";
import { CommonModule } from "../common/common.module";

@Module({
  imports: [TypeOrmModule.forFeature([ScoreEvent]), TrendModule, CommonModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
