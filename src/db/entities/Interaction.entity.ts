import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { UserProfile } from "./UserProfile.entity";
import { Trend } from "./Trend.entity";
import { Product } from "./Product.entity";

@Entity("interactions")
export class Interaction {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid", name: "user_id", nullable: true })
  userId!: string | null;

  @ManyToOne(() => UserProfile, (profile) => profile.interactions, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "user_id" })
  user!: UserProfile | null;

  @Column({ type: "uuid", name: "trend_id", nullable: true })
  trendId!: string | null;

  @ManyToOne(() => Trend, (trend) => trend.interactions, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "trend_id" })
  trend!: Trend | null;

  @Column({ type: "uuid", name: "product_id", nullable: true })
  productId!: string | null;

  @ManyToOne(() => Product, (product) => product.interactions, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "product_id" })
  product!: Product | null;

  @Column({ type: "varchar", name: "interaction_type" })
  interactionType!: string; // 'VIEW', 'SAVE', 'CLICK', 'SHARE'

  @Column({ type: "varchar", name: "source_type", nullable: true })
  sourceType!: string | null;

  @Column({ type: "text", nullable: true })
  content!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
