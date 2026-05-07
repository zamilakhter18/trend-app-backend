import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { Trend } from "./Trend.entity";

@Entity("ai_analysis")
export class AiAnalysis {
  @PrimaryColumn("uuid", { name: "trend_id" })
  trendId!: string;

  @OneToOne(() => Trend, (trend) => trend.aiAnalysis, { onDelete: "CASCADE" })
  @JoinColumn({ name: "trend_id" })
  trend!: Trend;

  @Column("jsonb", { name: "raw_analysis", nullable: true })
  rawAnalysis!: any;

  @Column({ name: "refined_summary", type: "text", nullable: true })
  refinedSummary!: string;

  @Column("text", { array: true, default: "{}" })
  keywords!: string[];

  @Column("jsonb", { name: "vision_data", nullable: true })
  visionData!: any;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
