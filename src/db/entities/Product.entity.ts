import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Trend } from "./Trend.entity";
import { Clickout } from "./Clickout.entity";
import { Interaction } from "./Interaction.entity";
import { Save } from "./Save.entity";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "trend_id", nullable: true })
  trendId!: string;

  @ManyToOne(() => Trend, (trend) => trend.products, { onDelete: "CASCADE" })
  @JoinColumn({ name: "trend_id" })
  trend!: Trend;

  @Column()
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column("decimal", { precision: 12, scale: 2, nullable: true })
  price!: number;

  @Column({ default: "USD" })
  currency!: string;

  @Column({ name: "affiliate_url" })
  affiliateUrl!: string;

  @Column({ name: "image_url", nullable: true })
  imageUrl!: string;

  @Column({ name: "is_sponsored", default: false })
  isSponsored!: boolean;

  @Column({ name: "is_authentic", default: true })
  isAuthentic!: boolean;

  @Column({ name: "merchant_name", nullable: true })
  merchantName!: string;

  @Column({ name: "affiliate_network", nullable: true })
  affiliateNetwork!: string;

  @Column({ name: "commerce_metadata", type: "jsonb", nullable: true })
  commerceMetadata!: any;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @OneToMany(() => Clickout, (clickout) => clickout.product)
  clickouts!: Clickout[];

  @OneToMany(() => Interaction, (interaction) => interaction.product)
  interactions!: Interaction[];

  @OneToMany(() => Save, (save) => save.product)
  saves!: Save[];
}
