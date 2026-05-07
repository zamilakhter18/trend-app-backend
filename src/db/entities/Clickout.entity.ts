import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { UserProfile } from "./UserProfile.entity";
import { Product } from "./Product.entity";
import { Trend } from "./Trend.entity";
import { CreatorCampaign } from "./CreatorCampaign.entity";
import { ClickSourceType } from "../../common/helpers/enum";

@Entity("clickouts")
export class Clickout {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", nullable: true })
  userId!: string | null;

  @ManyToOne(() => UserProfile, (profile) => profile.clickouts, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "user_id" })
  user!: UserProfile;

  @Column({ name: "product_id" })
  productId!: string;

  @ManyToOne(() => Product, (product) => product.clickouts, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @Column({ name: "trend_id", nullable: true })
  trendId!: string | null;

  @ManyToOne(() => Trend, { onDelete: "SET NULL" })
  @JoinColumn({ name: "trend_id" })
  trend!: Trend;

  @Column({ name: "campaign_id", nullable: true })
  campaignId!: string | null;

  @ManyToOne(() => CreatorCampaign, { onDelete: "SET NULL" })
  @JoinColumn({ name: "campaign_id" })
  campaign!: CreatorCampaign;

  @Column({
    type: "enum",
    enum: ClickSourceType,
    name: "source_type",
    default: ClickSourceType.ORGANIC_FEED,
  })
  sourceType!: ClickSourceType;

  @Column({ name: "creator_id", nullable: true })
  creatorId!: string | null;

  @ManyToOne(() => UserProfile, { onDelete: "SET NULL" })
  @JoinColumn({ name: "creator_id" })
  creator!: UserProfile;

  @Column({ name: "session_id", type: "text", nullable: true })
  sessionId!: string | null;

  @Column({ name: "ip_hash", type: "text", nullable: true })
  ipHash!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
