import {
  Entity,
  PrimaryColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Trend } from './Trend.entity';

@Entity('trend_scores')
export class TrendScore {
  @PrimaryColumn('uuid', { name: 'trend_id' })
  trendId!: string;

  @OneToOne(() => Trend, (trend) => trend.score, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trend_id' })
  trend!: Trend;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  score!: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  velocity!: number;

  @Column({ name: 'engagement_count', default: 0 })
  engagementCount!: number;

  @UpdateDateColumn({ name: 'last_updated', type: 'timestamptz' })
  lastUpdated!: Date;
}
