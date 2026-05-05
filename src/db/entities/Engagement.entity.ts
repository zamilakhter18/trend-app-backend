import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserProfile } from './UserProfile.entity';
import { Trend } from './Trend.entity';

@Entity('engagements')
export class Engagement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @ManyToOne(() => UserProfile, (profile) => profile.engagements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserProfile;

  @Column({ name: 'trend_id', nullable: true })
  trendId: string;

  @ManyToOne(() => Trend, (trend) => trend.engagements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trend_id' })
  trend: Trend;

  @Column()
  type: string; // 'like', 'comment', 'share'

  @Column({ type: 'text', nullable: true })
  content: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
