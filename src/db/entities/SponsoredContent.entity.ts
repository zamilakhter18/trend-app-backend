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
import { UserProfile } from './UserProfile.entity';

@Entity('sponsored_content')
export class SponsoredContent {
  @PrimaryColumn('uuid', { name: 'trend_id' })
  trendId: string;

  @OneToOne(() => Trend, (trend) => trend.sponsoredContent, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'trend_id' })
  trend: Trend;

  @Column({ name: 'advertiser_id', nullable: true })
  advertiserId: string;

  @ManyToOne(() => UserProfile, (profile) => profile.sponsoredContents, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'advertiser_id' })
  advertiser: UserProfile;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  budget: number;

  @Column('decimal', { name: 'bid_amount', precision: 12, scale: 2, nullable: true })
  bidAmount: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'starts_at', type: 'timestamptz', nullable: true })
  startsAt: Date;

  @Column({ name: 'ends_at', type: 'timestamptz', nullable: true })
  endsAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
