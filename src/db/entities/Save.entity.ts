import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserProfile } from './UserProfile.entity';
import { Trend } from './Trend.entity';

@Entity('saves')
export class Save {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserProfile, (profile) => profile.saves, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserProfile;

  @PrimaryColumn('uuid', { name: 'trend_id' })
  trendId: string;

  @ManyToOne(() => Trend, (trend) => trend.saves, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trend_id' })
  trend: Trend;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
