import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { UserProfile } from "./UserProfile.entity";
import { TrendContent } from "./TrendContent.entity";
import { TrendMetadata } from "./TrendMetadata.entity";
import { Interaction } from "./Interaction.entity";
import { Save } from "./Save.entity";
import { Product } from "./Product.entity";
import { AiAnalysis } from "./AiAnalysis.entity";
import { TrendScore } from "./TrendScore.entity";
import { SponsoredContent } from "./SponsoredContent.entity";

@Entity("trends")
export class Trend {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "creator_id", nullable: true })
  creatorId!: string;

  @Column({ type: "character varying", default: "other" })
  source!: string;

  @Column({ name: "external_id", nullable: true })
  externalId!: string;

  @ManyToOne(() => UserProfile, (profile) => profile.trends, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "creator_id" })
  creator!: UserProfile;

  @Column()
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column({
    type: "text",
    default: "emerging",
  })
  phase!: "emerging" | "rising" | "peak" | "fading";

  @Column({ name: "phase_updated_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  phaseUpdatedAt!: Date;

  @Column({ name: "content_type", default: "ORGANIC" })
  contentType!: string; // 'ORGANIC', 'SPONSORED'

  @Column({ default: "PUBLISHED" })
  status!: string; // 'DRAFT', 'PUBLISHED', 'ARCHIVED', 'FLAGGED'

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @OneToMany(() => TrendContent, (content) => content.trend)
  contents!: TrendContent[];

  @OneToOne(() => TrendMetadata, (metadata) => metadata.trend)
  metadata!: TrendMetadata;

  @OneToMany(() => Interaction, (interaction) => interaction.trend)
  interactions!: Interaction[];

  @OneToMany(() => Save, (save) => save.trend)
  saves!: Save[];

  @OneToMany(() => Product, (product) => product.trend)
  products!: Product[];

  @OneToOne(() => AiAnalysis, (analysis) => analysis.trend)
  aiAnalysis!: AiAnalysis;

  @OneToOne(() => TrendScore, (score) => score.trend)
  score!: TrendScore;

  @OneToOne(() => SponsoredContent, (sponsored) => sponsored.trend)
  sponsoredContent!: SponsoredContent;
}
