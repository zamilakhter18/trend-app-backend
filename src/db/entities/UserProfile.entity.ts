import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Trend } from './Trend.entity';
import { Engagement } from './Engagement.entity';
import { Save } from './Save.entity';
import { Clickout } from './Clickout.entity';
import { SponsoredContent } from './SponsoredContent.entity';

@Entity('user_profile')
export class UserProfile {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId!: string;

  @Column({ unique: true, nullable: true })
  username!: string;

  @Column({ name: 'full_name', nullable: true })
  fullName!: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl!: string;

  @Column('decimal', {
    name: 'trend_score',
    precision: 10,
    scale: 2,
    default: 0,
  })
  trendScore!: number;

  @Column({ default: 1 })
  level!: number;

  @Column('text', { array: true, default: '{}' })
  badges!: string[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => Trend, (trend) => trend.creator)
  trends!: Trend[];

  @OneToMany(() => Engagement, (engagement) => engagement.user)
  engagements!: Engagement[];

  @OneToMany(() => Save, (save) => save.user)
  saves!: Save[];

  @OneToMany(() => Clickout, (clickout) => clickout.user)
  clickouts!: Clickout[];

  @OneToMany(() => SponsoredContent, (sponsored) => sponsored.advertiser)
  sponsoredContents!: SponsoredContent[];
}
