import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Brand } from "./Brand.entity";

@Entity("discount_codes")
export class DiscountCode {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  code!: string;

  @Column({ name: "brand_id", nullable: true })
  brandId!: string;

  @ManyToOne(() => Brand, { onDelete: "SET NULL" })
  @JoinColumn({ name: "brand_id" })
  brand!: Brand;

  @Column({
    type: "character varying",
    name: "discount_type",
    default: "PERCENTAGE",
  })
  discountType!: "PERCENTAGE" | "FIXED_AMOUNT";

  @Column("decimal", {
    name: "discount_value",
    precision: 10,
    scale: 2,
  })
  discountValue!: number;

  @Column({
    name: "min_score_required",
    default: 0,
  })
  minScoreRequired!: number;

  @Column({
    type: "integer",
    name: "max_uses",
    nullable: true,
  })
  maxUses!: number | null;

  @Column({
    name: "use_count",
    default: 0,
  })
  useCount!: number;

  @Column({
    name: "is_active",
    default: true,
  })
  isActive!: boolean;

  @Column({
    name: "expires_at",
    type: "timestamptz",
    nullable: true,
  })
  expiresAt!: Date | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
