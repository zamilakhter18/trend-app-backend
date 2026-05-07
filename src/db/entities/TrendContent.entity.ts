import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Trend } from "./Trend.entity";
import { TrendContentMediaTypeEnum } from "../../common/helpers/enum";

@Entity("trend_content")
export class TrendContent {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "trend_id" })
  trendId!: string;

  @ManyToOne(() => Trend, (trend) => trend.contents, { onDelete: "CASCADE" })
  @JoinColumn({ name: "trend_id" })
  trend!: Trend;

  @Column({ name: "content_url" })
  contentUrl!: string;

  @Column({
    type: "enum",
    enum: TrendContentMediaTypeEnum,
    name: "content_type",
  })
  contentType!: TrendContentMediaTypeEnum;

  @Column({ name: "is_primary", default: false })
  isPrimary!: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
