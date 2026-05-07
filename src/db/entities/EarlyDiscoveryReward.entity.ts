import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { UserProfile } from "./UserProfile.entity";
import { Trend } from "./Trend.entity";
import { TrendPhaseEnum, RewardTypeEnum } from "../../common/helpers/enum";

@Entity("early_discovery_rewards")
export class EarlyDiscoveryReward {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id" })
  userId!: string;

  @ManyToOne(() => UserProfile, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: UserProfile;

  @Column({ name: "trend_id" })
  trendId!: string;

  @ManyToOne(() => Trend, { onDelete: "CASCADE" })
  @JoinColumn({ name: "trend_id" })
  trend!: Trend;

  @Column({
    type: "enum",
    enum: TrendPhaseEnum,
    name: "phase_at_discovery",
  })
  phaseAtDiscovery!: TrendPhaseEnum;

  @Column("decimal", {
    name: "bonus_points",
    precision: 10,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  bonusPoints!: number;

  @Column({
    type: "enum",
    enum: RewardTypeEnum,
    name: "reward_type",
    default: RewardTypeEnum.POINTS,
  })
  rewardType!: RewardTypeEnum;

  @Column({ default: false })
  claimed!: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
