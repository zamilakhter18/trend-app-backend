import {
  Entity,
  PrimaryColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Trend } from './Trend.entity';

@Entity('trend_metadata')
export class TrendMetadata {
  @PrimaryColumn('uuid', { name: 'trend_id' })
  trendId!: string;

  @OneToOne(() => Trend, (trend) => trend.metadata, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trend_id' })
  trend!: Trend;

  @Column('text', { array: true, default: '{}' })
  tags!: string[];

  @Column('text', { array: true, default: '{}' })
  categories!: string[];

  @Column('decimal', {
    name: 'sentiment_score',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  sentimentScore!: number;

  @Column({ name: 'ai_summary', type: 'text', nullable: true })
  aiSummary!: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
