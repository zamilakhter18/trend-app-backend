import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Trend } from './Trend.entity';
import { Brand } from './Brand.entity';

@Entity('sponsored_content')
export class SponsoredContent {
  @PrimaryColumn('uuid', { name: 'trend_id' })
  trendId!: string;

  @OneToOne(() => Trend, (trend) => trend.sponsoredContent, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'trend_id' })
  trend!: Trend;

  @Column({ name: 'brand_id', nullable: true })
  brandId!: string;

  @ManyToOne(() => Brand, (brand) => brand.sponsoredContents, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'brand_id' })
  brand!: Brand;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  budget!: number;

  @Column('decimal', { name: 'placement_bid', precision: 12, scale: 2, nullable: true })
  placementBid!: number;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @Column({ name: 'sponsor_name', nullable: true })
  sponsorName!: string;

  @Column({ name: 'campaign_name', nullable: true })
  campaignName!: string;

  @Column({ name: 'campaign_priority', default: 0 })
  campaignPriority!: number;

  @Column({ name: 'starts_at', type: 'timestamptz', nullable: true })
  startsAt!: Date;

  @Column({ name: 'ends_at', type: 'timestamptz', nullable: true })
  endsAt!: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
