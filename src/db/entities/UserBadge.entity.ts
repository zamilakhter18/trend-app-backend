import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { UserProfile } from "./UserProfile.entity";
import { Trend } from "./Trend.entity";
import { BadgeTypeEnum } from "../../common/helpers/enum";

@Entity("user_badges")
export class UserBadge {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id" })
  userId!: string;

  @ManyToOne(() => UserProfile, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: UserProfile;

  @Column({
    type: "enum",
    enum: BadgeTypeEnum,
    name: "badge_type",
  })
  badgeType!: BadgeTypeEnum;

  @Column({
    type: "timestamptz",
    name: "earned_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  earnedAt!: Date;

  @Column({ name: "source_trend_id", type: "uuid", nullable: true })
  sourceTrendId!: string | null;

  @ManyToOne(() => Trend, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "source_trend_id" })
  sourceTrend!: Trend | null;

  @Column({ type: "jsonb", nullable: true, default: "{}" })
  metadata!: any;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
