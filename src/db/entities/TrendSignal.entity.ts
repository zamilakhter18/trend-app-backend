import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Trend } from "./Trend.entity";
import { SignalTypeEnum, PlatformEnum } from "../../common/helpers/enum";

@Entity("trend_signals")
export class TrendSignal {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "trend_id" })
  trendId!: string;

  @ManyToOne(() => Trend, { onDelete: "CASCADE" })
  @JoinColumn({ name: "trend_id" })
  trend!: Trend;

  @Column({
    type: "enum",
    enum: PlatformEnum,
    default: PlatformEnum.OTHER,
  })
  source!: PlatformEnum;

  @Column({
    type: "enum",
    enum: SignalTypeEnum,
    name: "signal_type",
  })
  signalType!: SignalTypeEnum;

  @Column("decimal", {
    name: "signal_value",
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  signalValue!: number;

  @Column({ type: "jsonb", nullable: true, default: "{}" })
  metadata!: any;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
