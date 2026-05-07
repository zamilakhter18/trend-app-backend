import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { UserProfile } from "./UserProfile.entity";
import { ScoreReasonEnum, ScoreSourceTypeEnum } from "../../common/helpers/enum";

@Entity("score_events")
export class ScoreEvent {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id" })
  userId!: string;

  @ManyToOne(() => UserProfile, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: UserProfile;

  @Column("decimal", {
    name: "points_delta",
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  pointsDelta!: number;

  @Column({
    type: "enum",
    enum: ScoreReasonEnum,
  })
  reason!: ScoreReasonEnum;

  @Column({
    type: "enum",
    enum: ScoreSourceTypeEnum,
    name: "source_type",
  })
  sourceType!: ScoreSourceTypeEnum;

  @Column({ name: "source_id", type: "uuid", nullable: true })
  sourceId!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
