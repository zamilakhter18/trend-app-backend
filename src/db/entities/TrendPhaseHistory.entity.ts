import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Trend } from "./Trend.entity";
import { TrendPhaseEnum } from "../../common/helpers/enum";

@Entity("trend_phase_history")
export class TrendPhaseHistory {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "trend_id" })
  trendId!: string;

  @ManyToOne(() => Trend, { onDelete: "CASCADE" })
  @JoinColumn({ name: "trend_id" })
  trend!: Trend;

  @Column({
    type: "enum",
    enum: TrendPhaseEnum,
    name: "old_phase",
    nullable: true
  })
  oldPhase!: TrendPhaseEnum | null;

  @Column({
    type: "enum",
    enum: TrendPhaseEnum,
    name: "new_phase"
  })
  newPhase!: TrendPhaseEnum;

  @CreateDateColumn({ name: "changed_at", type: "timestamptz" })
  changedAt!: Date;

  @Column({ type: "jsonb", nullable: true, default: "{}" })
  metadata!: any;
}
