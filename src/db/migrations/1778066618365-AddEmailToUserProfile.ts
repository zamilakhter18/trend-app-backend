import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailToUserProfile1778066618365 implements MigrationInterface {
  name = "AddEmailToUserProfile1778066618365";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "trend_scores" ADD "final_score" numeric(12,2) NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "trend_scores" ADD "ctr_score" numeric(12,2) NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "trend_scores" ADD "save_rate_score" numeric(12,2) NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "trend_scores" ADD "calculated_at" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`ALTER TABLE "sponsored_content" ADD "sponsor_name" character varying`);
    await queryRunner.query(`ALTER TABLE "sponsored_content" ADD "campaign_name" character varying`);
    await queryRunner.query(`ALTER TABLE "sponsored_content" ADD "priority_score" integer NOT NULL DEFAULT '0'`);
    await queryRunner.query(`CREATE TYPE "public"."trends_source_enum" AS ENUM('instagram', 'tiktok', 'x', 'pinterest', 'other')`);
    await queryRunner.query(`ALTER TABLE "trends" ADD "source" "public"."trends_source_enum" NOT NULL DEFAULT 'other'`);
    await queryRunner.query(`ALTER TABLE "trends" ADD "external_id" character varying`);
    await queryRunner.query(`ALTER TABLE "user_profile" ADD "email" character varying`);
    await queryRunner.query(`ALTER TABLE "user_profile" ADD CONSTRAINT "UQ_e336cc51b61c40b1b1731308aa5" UNIQUE ("email")`);
    await queryRunner.query(`CREATE TYPE "public"."user_profile_role_enum" AS ENUM('user', 'admin', 'creator')`);
    await queryRunner.query(`ALTER TABLE "user_profile" ADD "role" "public"."user_profile_role_enum" NOT NULL DEFAULT 'user'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "role"`);
    await queryRunner.query(`DROP TYPE "public"."user_profile_role_enum"`);
    await queryRunner.query(`ALTER TABLE "user_profile" DROP CONSTRAINT "UQ_e336cc51b61c40b1b1731308aa5"`);
    await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "email"`);
    await queryRunner.query(`ALTER TABLE "trends" DROP COLUMN "external_id"`);
    await queryRunner.query(`ALTER TABLE "trends" DROP COLUMN "source"`);
    await queryRunner.query(`DROP TYPE "public"."trends_source_enum"`);
    await queryRunner.query(`ALTER TABLE "sponsored_content" DROP COLUMN "priority_score"`);
    await queryRunner.query(`ALTER TABLE "sponsored_content" DROP COLUMN "campaign_name"`);
    await queryRunner.query(`ALTER TABLE "sponsored_content" DROP COLUMN "sponsor_name"`);
    await queryRunner.query(`ALTER TABLE "trend_scores" DROP COLUMN "calculated_at"`);
    await queryRunner.query(`ALTER TABLE "trend_scores" DROP COLUMN "save_rate_score"`);
    await queryRunner.query(`ALTER TABLE "trend_scores" DROP COLUMN "ctr_score"`);
    await queryRunner.query(`ALTER TABLE "trend_scores" DROP COLUMN "final_score"`);
  }
}
