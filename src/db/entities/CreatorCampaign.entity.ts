import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { CreatorProfile } from "./CreatorProfile.entity";
import { Brand } from "./Brand.entity";
import { CreatorCampaignStatusEnum } from "../../common/helpers/enum";

@Entity("creator_campaigns")
export class CreatorCampaign {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "creator_profile_id" })
  creatorProfileId!: string;

  @ManyToOne(() => CreatorProfile, { onDelete: "CASCADE" })
  @JoinColumn({ name: "creator_profile_id" })
  creatorProfile!: CreatorProfile;

  @Column({ name: "brand_id" })
  brandId!: string;

  @ManyToOne(() => Brand, { onDelete: "CASCADE" })
  @JoinColumn({ name: "brand_id" })
  brand!: Brand;

  @Column()
  name!: string;

  @Column({
    type: "enum",
    enum: CreatorCampaignStatusEnum,
    default: CreatorCampaignStatusEnum.PENDING,
  })
  status!: CreatorCampaignStatusEnum;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  budget!: number;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
