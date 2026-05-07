import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { UserProfile } from "./UserProfile.entity";

@Entity("creator_profiles")
export class CreatorProfile {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id" })
  userId!: string;

  @OneToOne(() => UserProfile, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: UserProfile;

  @Column({ type: "text", nullable: true })
  bio!: string;

  @Column({ name: "portfolio_url", nullable: true })
  portfolioUrl!: string;

  @Column({ type: "jsonb", default: "{}" })
  socialLinks!: any;

  @Column({ default: false })
  isVerified!: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
