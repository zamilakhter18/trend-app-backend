import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Trend } from "./Trend.entity";
import { Brand } from "./Brand.entity";

@Entity("sponsored_content")
export class SponsoredContent {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "trend_id" })
  trendId!: string;

  @ManyToOne(() => Trend, (trend) => trend.sponsoredCampaigns, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "trend_id" })
  trend!: Trend;

  @Column({ name: "brand_id", nullable: true })
  brandId!: string;

  @ManyToOne(() => Brand, (brand) => brand.sponsoredContents, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "brand_id" })
  brand!: Brand;

  @Column("decimal", { precision: 12, scale: 2, nullable: true })
  budget!: number;

  @Column("decimal", { name: "placement_bid", precision: 12, scale: 2, nullable: true })
  placementBid!: number;

  @Column({ name: "is_active", default: true })
  isActive!: boolean;

  @Column({ name: "sponsor_name", nullable: true })
  sponsorName!: string;

  @Column({ name: "campaign_name", nullable: true })
  campaignName!: string;

  /**
   * Used for paid placement slot weighting.
   * CRITICAL: This MUST NOT be used for organic trend ranking or feed sorting.
   */
  @Column({ name: "placement_slot_weight", default: 0, comment: "Weight for paid placement logic, NOT organic ranking" })
  placementSlotWeight!: number;

  @Column({ name: "starts_at", type: "timestamptz", nullable: true })
  startsAt!: Date;

  @Column({ name: "ends_at", type: "timestamptz", nullable: true })
  endsAt!: Date;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
