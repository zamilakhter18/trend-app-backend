import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorClickouts1778147602397 implements MigrationInterface {
    name = 'RefactorClickouts1778147602397'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sponsored_content" DROP CONSTRAINT "FK_8e105b187066e0e5ad2be737a03"`);
        await queryRunner.query(`CREATE TABLE "creator_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "bio" text, "portfolio_url" character varying, "socialLinks" jsonb NOT NULL DEFAULT '{}', "isVerified" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "REL_6fae0dfbe41d4c7b37a6e3251c" UNIQUE ("user_id"), CONSTRAINT "PK_5f58900809b867a2683b6e0e94a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "brands" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "verified" boolean NOT NULL DEFAULT false, "billing_metadata" jsonb, "website_url" character varying, "logo_url" character varying, "owner_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_96db6bbbaa6f23cad26871339b6" UNIQUE ("name"), CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."creator_campaigns_status_enum" AS ENUM('pending', 'active', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "creator_campaigns" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "creator_profile_id" uuid NOT NULL, "brand_id" uuid NOT NULL, "name" character varying NOT NULL, "status" "public"."creator_campaigns_status_enum" NOT NULL DEFAULT 'pending', "budget" numeric(10,2), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_04e6c3a196e76b48daf0d926233" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_badges_badge_type_enum" AS ENUM('EARLY_SPOTTER', 'STREETWEAR_EXPERT', 'LUXURY_CURATOR', 'TREND_HUNTER')`);
        await queryRunner.query(`CREATE TABLE "user_badges" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "badge_type" "public"."user_badges_badge_type_enum" NOT NULL, "earned_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "source_trend_id" uuid, "metadata" jsonb DEFAULT '{}', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_0ca139216824d745a930065706a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "creator_analytics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "creator_profile_id" uuid NOT NULL, "totalReach" integer NOT NULL DEFAULT '0', "totalEngagement" integer NOT NULL DEFAULT '0', "averageEngagementRate" numeric(5,2) NOT NULL DEFAULT '0', "audienceDemographics" jsonb NOT NULL DEFAULT '{}', "last_updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "REL_662863428b4a9f3b241b78894b" UNIQUE ("creator_profile_id"), CONSTRAINT "PK_65a00a6f6026c4174d08f15a3d0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sponsored_content" DROP COLUMN "advertiser_id"`);
        await queryRunner.query(`ALTER TABLE "sponsored_content" DROP COLUMN "bid_amount"`);
        await queryRunner.query(`ALTER TABLE "sponsored_content" DROP COLUMN "priority_score"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "level"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "badges"`);
        await queryRunner.query(`ALTER TABLE "sponsored_content" ADD "brand_id" uuid`);
        await queryRunner.query(`ALTER TABLE "sponsored_content" ADD "placement_bid" numeric(12,2)`);
        await queryRunner.query(`ALTER TABLE "sponsored_content" ADD "campaign_priority" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "clickouts" ADD "trend_id" uuid`);
        await queryRunner.query(`ALTER TABLE "clickouts" ADD "campaign_id" uuid`);
        await queryRunner.query(`CREATE TYPE "public"."clickouts_source_type_enum" AS ENUM('ORGANIC_FEED', 'SPONSORED_FEED', 'CREATOR_PROFILE', 'SEARCH', 'RECOMMENDED')`);
        await queryRunner.query(`ALTER TABLE "clickouts" ADD "source_type" "public"."clickouts_source_type_enum" NOT NULL DEFAULT 'ORGANIC_FEED'`);
        await queryRunner.query(`ALTER TABLE "clickouts" ADD "creator_id" uuid`);
        await queryRunner.query(`ALTER TABLE "clickouts" ADD "session_id" text`);
        await queryRunner.query(`ALTER TABLE "clickouts" ADD "ip_hash" text`);
        await queryRunner.query(`ALTER TABLE "clickouts" DROP CONSTRAINT "FK_21d5402615f2a6ec059af906b02"`);
        await queryRunner.query(`ALTER TABLE "clickouts" ALTER COLUMN "product_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" ADD CONSTRAINT "FK_6fae0dfbe41d4c7b37a6e3251c5" FOREIGN KEY ("user_id") REFERENCES "user_profile"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sponsored_content" ADD CONSTRAINT "FK_03adf1632f01ddc43592d85d43d" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "brands" ADD CONSTRAINT "FK_c28afa0db2ceaa90125fad8f8b9" FOREIGN KEY ("owner_id") REFERENCES "user_profile"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "creator_campaigns" ADD CONSTRAINT "FK_a795a2571996d50efb9e3db9385" FOREIGN KEY ("creator_profile_id") REFERENCES "creator_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "creator_campaigns" ADD CONSTRAINT "FK_8c1de04673f81e4a9a4042b2731" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clickouts" ADD CONSTRAINT "FK_21d5402615f2a6ec059af906b02" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clickouts" ADD CONSTRAINT "FK_7b5586a57157b532e50a55004cc" FOREIGN KEY ("trend_id") REFERENCES "trends"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clickouts" ADD CONSTRAINT "FK_f3b0947701b4718bdb7c1bcfdc9" FOREIGN KEY ("campaign_id") REFERENCES "creator_campaigns"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clickouts" ADD CONSTRAINT "FK_e421ad2735bb458c5eb10ae08f7" FOREIGN KEY ("creator_id") REFERENCES "user_profile"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_badges" ADD CONSTRAINT "FK_f1221d9b1aaa64b1f3c98ed46d3" FOREIGN KEY ("user_id") REFERENCES "user_profile"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_badges" ADD CONSTRAINT "FK_1b70a2e69c7b111e9b1de692d05" FOREIGN KEY ("source_trend_id") REFERENCES "trends"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "creator_analytics" ADD CONSTRAINT "FK_662863428b4a9f3b241b78894bf" FOREIGN KEY ("creator_profile_id") REFERENCES "creator_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "creator_analytics" DROP CONSTRAINT "FK_662863428b4a9f3b241b78894bf"`);
        await queryRunner.query(`ALTER TABLE "user_badges" DROP CONSTRAINT "FK_1b70a2e69c7b111e9b1de692d05"`);
        await queryRunner.query(`ALTER TABLE "user_badges" DROP CONSTRAINT "FK_f1221d9b1aaa64b1f3c98ed46d3"`);
        await queryRunner.query(`ALTER TABLE "clickouts" DROP CONSTRAINT "FK_e421ad2735bb458c5eb10ae08f7"`);
        await queryRunner.query(`ALTER TABLE "clickouts" DROP CONSTRAINT "FK_f3b0947701b4718bdb7c1bcfdc9"`);
        await queryRunner.query(`ALTER TABLE "clickouts" DROP CONSTRAINT "FK_7b5586a57157b532e50a55004cc"`);
        await queryRunner.query(`ALTER TABLE "clickouts" DROP CONSTRAINT "FK_21d5402615f2a6ec059af906b02"`);
        await queryRunner.query(`ALTER TABLE "creator_campaigns" DROP CONSTRAINT "FK_8c1de04673f81e4a9a4042b2731"`);
        await queryRunner.query(`ALTER TABLE "creator_campaigns" DROP CONSTRAINT "FK_a795a2571996d50efb9e3db9385"`);
        await queryRunner.query(`ALTER TABLE "brands" DROP CONSTRAINT "FK_c28afa0db2ceaa90125fad8f8b9"`);
        await queryRunner.query(`ALTER TABLE "sponsored_content" DROP CONSTRAINT "FK_03adf1632f01ddc43592d85d43d"`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" DROP CONSTRAINT "FK_6fae0dfbe41d4c7b37a6e3251c5"`);
        await queryRunner.query(`ALTER TABLE "clickouts" ALTER COLUMN "product_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clickouts" ADD CONSTRAINT "FK_21d5402615f2a6ec059af906b02" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clickouts" DROP COLUMN "ip_hash"`);
        await queryRunner.query(`ALTER TABLE "clickouts" DROP COLUMN "session_id"`);
        await queryRunner.query(`ALTER TABLE "clickouts" DROP COLUMN "creator_id"`);
        await queryRunner.query(`ALTER TABLE "clickouts" DROP COLUMN "source_type"`);
        await queryRunner.query(`DROP TYPE "public"."clickouts_source_type_enum"`);
        await queryRunner.query(`ALTER TABLE "clickouts" DROP COLUMN "campaign_id"`);
        await queryRunner.query(`ALTER TABLE "clickouts" DROP COLUMN "trend_id"`);
        await queryRunner.query(`ALTER TABLE "sponsored_content" DROP COLUMN "campaign_priority"`);
        await queryRunner.query(`ALTER TABLE "sponsored_content" DROP COLUMN "placement_bid"`);
        await queryRunner.query(`ALTER TABLE "sponsored_content" DROP COLUMN "brand_id"`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "badges" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "level" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "sponsored_content" ADD "priority_score" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "sponsored_content" ADD "bid_amount" numeric(12,2)`);
        await queryRunner.query(`ALTER TABLE "sponsored_content" ADD "advertiser_id" uuid`);
        await queryRunner.query(`DROP TABLE "creator_analytics"`);
        await queryRunner.query(`DROP TABLE "user_badges"`);
        await queryRunner.query(`DROP TYPE "public"."user_badges_badge_type_enum"`);
        await queryRunner.query(`DROP TABLE "creator_campaigns"`);
        await queryRunner.query(`DROP TYPE "public"."creator_campaigns_status_enum"`);
        await queryRunner.query(`DROP TABLE "brands"`);
        await queryRunner.query(`DROP TABLE "creator_profiles"`);
        await queryRunner.query(`ALTER TABLE "sponsored_content" ADD CONSTRAINT "FK_8e105b187066e0e5ad2be737a03" FOREIGN KEY ("advertiser_id") REFERENCES "user_profile"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
