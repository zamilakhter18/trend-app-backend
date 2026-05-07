import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Check } from "typeorm";
import { UserProfile } from "./UserProfile.entity";
import { Trend } from "./Trend.entity";
import { Product } from "./Product.entity";

@Entity("saves")
@Check(`("trend_id" IS NOT NULL AND "product_id" IS NULL) OR ("trend_id" IS NULL AND "product_id" IS NOT NULL)`)
export class Save {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id" })
  userId!: string;

  @ManyToOne(() => UserProfile, (profile) => profile.saves, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: UserProfile;

  @Column({ name: "trend_id", nullable: true })
  trendId!: string | null;

  @ManyToOne(() => Trend, (trend) => trend.saves, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "trend_id" })
  trend!: Trend | null;

  @Column({ name: "product_id", nullable: true })
  productId!: string | null;

  @ManyToOne(() => Product, (product) => product.saves, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "product_id" })
  product!: Product | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
