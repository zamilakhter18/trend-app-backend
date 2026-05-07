import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SponsoredContent } from './SponsoredContent.entity';
import { UserProfile } from './UserProfile.entity';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ default: false })
  verified!: boolean;

  @Column('jsonb', { name: 'billing_metadata', nullable: true })
  billingMetadata!: any;

  @Column({ name: 'website_url', nullable: true })
  websiteUrl!: string;

  @Column({ name: 'logo_url', nullable: true })
  logoUrl!: string;

  @Column({ name: 'owner_id', nullable: true })
  ownerId!: string;

  @ManyToOne(() => UserProfile, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'owner_id' })
  owner!: UserProfile;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => SponsoredContent, (sponsored) => sponsored.brand)
  sponsoredContents!: SponsoredContent[];
}
