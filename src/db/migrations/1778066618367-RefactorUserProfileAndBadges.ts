import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorUserProfileAndBadges1778066618367 implements MigrationInterface {
  name = 'RefactorUserProfileAndBadges1778066618367';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create Badge Type Enum
    await queryRunner.query(
      `CREATE TYPE "user_badge_type_enum" AS ENUM('EARLY_SPOTTER', 'STREETWEAR_EXPERT', 'LUXURY_CURATOR', 'TREND_HUNTER')`,
    );

    // Create user_badges table
    await queryRunner.query(
      `CREATE TABLE "user_badges" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "badge_type" "user_badge_type_enum" NOT NULL,
        "earned_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "source_trend_id" uuid,
        "metadata" jsonb DEFAULT '{}',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_badges" PRIMARY KEY ("id")
      )`,
    );

    // Add Foreign Key Constraints
    await queryRunner.query(
      `ALTER TABLE "user_badges" ADD CONSTRAINT "FK_user_badges_user_id" FOREIGN KEY ("user_id") REFERENCES "user_profile"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_badges" ADD CONSTRAINT "FK_user_badges_source_trend_id" FOREIGN KEY ("source_trend_id") REFERENCES "trends"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );

    // Migrate existing badges data
    // badges is text[] in user_profile
    await queryRunner.query(
      `INSERT INTO "user_badges" (user_id, badge_type)
       SELECT user_id, unnest(badges)::user_badge_type_enum
       FROM user_profile
       WHERE badges IS NOT NULL AND array_length(badges, 1) > 0`,
    );

    // Remove direct badges and level columns from user_profile
    await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "badges"`);
    await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "level"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add back columns
    await queryRunner.query(`ALTER TABLE "user_profile" ADD "level" integer DEFAULT 1`);
    await queryRunner.query(`ALTER TABLE "user_profile" ADD "badges" text[] DEFAULT '{}'`);

    // Restore level data (computed)
    await queryRunner.query(`UPDATE "user_profile" SET "level" = floor(trend_score / 100) + 1`);

    // Restore badges data (aggregated)
    await queryRunner.query(
      `UPDATE "user_profile"
       SET "badges" = array_agg(badge_type::text)
       FROM "user_badges"
       WHERE "user_profile"."user_id" = "user_badges"."user_id"
       GROUP BY "user_profile"."user_id"`,
    );

    // Drop user_badges table and enum
    await queryRunner.query(`DROP TABLE "user_badges"`);
    await queryRunner.query(`DROP TYPE "user_badge_type_enum"`);
  }
}
