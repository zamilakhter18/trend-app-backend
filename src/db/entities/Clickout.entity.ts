import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserProfile } from './UserProfile.entity';
import { Product } from './Product.entity';

@Entity('clickouts')
export class Clickout {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', nullable: true })
  userId!: string | null;

  @ManyToOne(() => UserProfile, (profile) => profile.clickouts, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserProfile;

  @Column({ name: 'product_id', nullable: true })
  productId!: string;

  @ManyToOne(() => Product, (product) => product.clickouts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
