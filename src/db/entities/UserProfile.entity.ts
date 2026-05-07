import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  AfterLoad,
  AfterInsert,
  AfterUpdate,
} from 'typeorm';
import { Trend } from './Trend.entity';
import { Engagement } from './Engagement.entity';
import { Save } from './Save.entity';
import { Clickout } from './Clickout.entity';
import { Brand } from './Brand.entity';
import { UserBadge } from './UserBadge.entity';
import { CreatorProfile } from './CreatorProfile.entity';
import { UserRoleEnum } from '../../common/helpers/enum';

@Entity('user_profile')
export class UserProfile {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId!: string;

  @Column({ unique: true, nullable: true })
  username!: string;

  @Column({ unique: true, nullable: true })
  email!: string;

  @Column({ name: 'full_name', nullable: true })
  fullName!: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl!: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.USER,
  })
  role!: UserRoleEnum;

  @Column('decimal', {
    name: 'trend_score',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  trendScore!: number;

  /**
   * Computed level based on trendScore.
   * Logic: level = floor(trend_score / 100) + 1 (starting at level 1)
   */
  level!: number;

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  computeLevel() {
    this.level = Math.floor(this.trendScore / 100) + 1;
  }

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => UserBadge, (badge) => badge.user)
  userBadges!: UserBadge[];

  @OneToMany(() => Trend, (trend) => trend.creator)
  trends!: Trend[];

  @OneToMany(() => Engagement, (engagement) => engagement.user)
  engagements!: Engagement[];

  @OneToMany(() => Save, (save) => save.user)
  saves!: Save[];

  @OneToMany(() => Clickout, (clickout) => clickout.user)
  clickouts!: Clickout[];

  @OneToMany(() => Brand, (brand) => brand.owner)
  brands!: Brand[];

  @OneToOne(() => CreatorProfile, (creator) => creator.user)
  creatorProfile!: CreatorProfile;
}
