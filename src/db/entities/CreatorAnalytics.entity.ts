import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, UpdateDateColumn } from "typeorm";
import { CreatorProfile } from "./CreatorProfile.entity";

@Entity("creator_analytics")
export class CreatorAnalytics {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "creator_profile_id" })
  creatorProfileId!: string;

  @OneToOne(() => CreatorProfile, { onDelete: "CASCADE" })
  @JoinColumn({ name: "creator_profile_id" })
  creatorProfile!: CreatorProfile;

  @Column({ default: 0 })
  totalReach!: number;

  @Column({ default: 0 })
  totalEngagement!: number;

  @Column("decimal", { precision: 5, scale: 2, default: 0 })
  averageEngagementRate!: number;

  @Column({ type: "jsonb", default: "{}" })
  audienceDemographics!: any;

  @UpdateDateColumn({ name: "last_updated", type: "timestamptz" })
  lastUpdated!: Date;
}
