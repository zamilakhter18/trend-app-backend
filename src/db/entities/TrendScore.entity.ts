import { Entity, PrimaryColumn, Column, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { Trend } from "./Trend.entity";

@Entity("trend_scores")
export class TrendScore {
  @PrimaryColumn("uuid", { name: "trend_id" })
  trendId!: string;

  @OneToOne(() => Trend, (trend) => trend.score, { onDelete: "CASCADE" })
  @JoinColumn({ name: "trend_id" })
  trend!: Trend;

  @Column("decimal", { precision: 12, scale: 2, default: 0 })
  score!: number;

  @Column("decimal", { name: "final_score", precision: 12, scale: 2, default: 0 })
  finalScore!: number;

  @Column("decimal", { precision: 12, scale: 2, default: 0 })
  velocity!: number;

  @Column("decimal", { name: "ctr_score", precision: 12, scale: 2, default: 0 })
  ctrScore!: number;

  @Column("decimal", { name: "save_rate_score", precision: 12, scale: 2, default: 0 })
  saveRateScore!: number;

  @Column({ name: "engagement_count", default: 0 })
  engagementCount!: number;

  @UpdateDateColumn({ name: "last_updated", type: "timestamptz" })
  lastUpdated!: Date;

  @Column({ name: "calculated_at", type: "timestamptz", nullable: true })
  calculatedAt!: Date;
}
