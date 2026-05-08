import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDiscountTypeToEnum1778240162937 implements MigrationInterface {
    name = 'UpdateDiscountTypeToEnum1778240162937'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trend_content" DROP COLUMN "content_type"`);
        await queryRunner.query(`CREATE TYPE "public"."trend_content_content_type_enum" AS ENUM('video', 'image', 'link')`);
        await queryRunner.query(`ALTER TABLE "trend_content" ADD "content_type" "public"."trend_content_content_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "interactions" DROP COLUMN "interaction_type"`);
        await queryRunner.query(`CREATE TYPE "public"."interactions_interaction_type_enum" AS ENUM('VIEW', 'SAVE', 'CLICK', 'SHARE')`);
        await queryRunner.query(`ALTER TABLE "interactions" ADD "interaction_type" "public"."interactions_interaction_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "interactions" DROP COLUMN "source_type"`);
        await queryRunner.query(`CREATE TYPE "public"."interactions_source_type_enum" AS ENUM('FEED', 'ORGANIC_FEED', 'SPONSORED_FEED', 'SEARCH', 'DISCOVERY', 'PROFILE', 'CREATOR_PROFILE', 'TREND_DETAIL', 'RECOMMENDED', 'SYSTEM')`);
        await queryRunner.query(`ALTER TABLE "interactions" ADD "source_type" "public"."interactions_source_type_enum"`);
        await queryRunner.query(`ALTER TABLE "trends" DROP COLUMN "content_type"`);
        await queryRunner.query(`CREATE TYPE "public"."trends_content_type_enum" AS ENUM('ORGANIC', 'SPONSORED')`);
        await queryRunner.query(`ALTER TABLE "trends" ADD "content_type" "public"."trends_content_type_enum" NOT NULL DEFAULT 'ORGANIC'`);
        await queryRunner.query(`ALTER TABLE "trends" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."trends_status_enum" AS ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED', 'FLAGGED')`);
        await queryRunner.query(`ALTER TABLE "trends" ADD "status" "public"."trends_status_enum" NOT NULL DEFAULT 'PUBLISHED'`);
        await queryRunner.query(`ALTER TYPE "public"."user_profile_role_enum" RENAME TO "user_profile_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."user_profile_role_enum" AS ENUM('user', 'admin', 'creator', 'brand')`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "role" TYPE "public"."user_profile_role_enum" USING "role"::"text"::"public"."user_profile_role_enum"`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "role" SET DEFAULT 'user'`);
        await queryRunner.query(`DROP TYPE "public"."user_profile_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "discount_codes" DROP COLUMN "discount_type"`);
        await queryRunner.query(`CREATE TYPE "public"."discount_codes_discount_type_enum" AS ENUM('PERCENTAGE', 'FIXED_AMOUNT')`);
        await queryRunner.query(`ALTER TABLE "discount_codes" ADD "discount_type" "public"."discount_codes_discount_type_enum" NOT NULL DEFAULT 'PERCENTAGE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discount_codes" DROP COLUMN "discount_type"`);
        await queryRunner.query(`DROP TYPE "public"."discount_codes_discount_type_enum"`);
        await queryRunner.query(`ALTER TABLE "discount_codes" ADD "discount_type" character varying NOT NULL DEFAULT 'PERCENTAGE'`);
        await queryRunner.query(`CREATE TYPE "public"."user_profile_role_enum_old" AS ENUM('user', 'admin', 'creator')`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "role" TYPE "public"."user_profile_role_enum_old" USING "role"::"text"::"public"."user_profile_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "role" SET DEFAULT 'user'`);
        await queryRunner.query(`DROP TYPE "public"."user_profile_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_profile_role_enum_old" RENAME TO "user_profile_role_enum"`);
        await queryRunner.query(`ALTER TABLE "trends" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."trends_status_enum"`);
        await queryRunner.query(`ALTER TABLE "trends" ADD "status" character varying NOT NULL DEFAULT 'PUBLISHED'`);
        await queryRunner.query(`ALTER TABLE "trends" DROP COLUMN "content_type"`);
        await queryRunner.query(`DROP TYPE "public"."trends_content_type_enum"`);
        await queryRunner.query(`ALTER TABLE "trends" ADD "content_type" character varying NOT NULL DEFAULT 'ORGANIC'`);
        await queryRunner.query(`ALTER TABLE "interactions" DROP COLUMN "source_type"`);
        await queryRunner.query(`DROP TYPE "public"."interactions_source_type_enum"`);
        await queryRunner.query(`ALTER TABLE "interactions" ADD "source_type" character varying`);
        await queryRunner.query(`ALTER TABLE "interactions" DROP COLUMN "interaction_type"`);
        await queryRunner.query(`DROP TYPE "public"."interactions_interaction_type_enum"`);
        await queryRunner.query(`ALTER TABLE "interactions" ADD "interaction_type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "trend_content" DROP COLUMN "content_type"`);
        await queryRunner.query(`DROP TYPE "public"."trend_content_content_type_enum"`);
        await queryRunner.query(`ALTER TABLE "trend_content" ADD "content_type" character varying NOT NULL`);
    }

}
