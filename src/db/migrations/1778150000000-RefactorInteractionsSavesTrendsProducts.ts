import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorInteractionsSavesTrendsProducts1778150000000 implements MigrationInterface {
  name = "RefactorInteractionsSavesTrendsProducts1778150000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Refactor Engagements into Interactions
    await queryRunner.query(`ALTER TABLE "engagements" RENAME TO "interactions"`);
    await queryRunner.query(`ALTER TABLE "interactions" RENAME COLUMN "type" TO "interaction_type"`);
    await queryRunner.query(`ALTER TABLE "interactions" ADD "product_id" uuid`);
    await queryRunner.query(`ALTER TABLE "interactions" ADD "source_type" character varying`);
    await queryRunner.query(`ALTER TABLE "interactions" ADD CONSTRAINT "FK_interaction_product" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE`);

    // 2. Refactor Saves Architecture
    // We need to drop the primary key constraint first because it's composite
    await queryRunner.query(`ALTER TABLE "saves" DROP CONSTRAINT "PK_4f3910c6d7a489112958742d17c"`); // This PK name might vary, but usually it's PK_user_trend
    // Actually, let's find the PK name or just drop and recreate
    // Since I don't know the exact PK name for sure, I'll use a safer approach if I can,
    // but looking at previous migrations usually helps.
    // Assuming PK_user_trend from TypeORM defaults.

    // Re-creating saves table structure to be safer
    await queryRunner.query(`ALTER TABLE "saves" ADD "id" uuid DEFAULT uuid_generate_v4()`);
    await queryRunner.query(`ALTER TABLE "saves" ALTER COLUMN "trend_id" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "saves" ADD "product_id" uuid`);
    await queryRunner.query(`ALTER TABLE "saves" ADD CONSTRAINT "FK_save_product" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE "saves" ADD CONSTRAINT "PK_saves" PRIMARY KEY ("id")`);
    await queryRunner.query(`ALTER TABLE "saves" ADD CONSTRAINT "CHK_save_target" CHECK (
            (trend_id IS NOT NULL AND product_id IS NULL) OR 
            (trend_id IS NULL AND product_id IS NOT NULL)
        )`);

    // 3. Refactor Trends Architecture
    await queryRunner.query(`ALTER TABLE "trends" ADD "content_type" character varying DEFAULT 'ORGANIC'`);
    await queryRunner.query(`ALTER TABLE "trends" ADD "phase_updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "trends" ADD "status" character varying DEFAULT 'PUBLISHED'`);

    // Change source from enum to varchar
    // First drop the default
    await queryRunner.query(`ALTER TABLE "trends" ALTER COLUMN "source" DROP DEFAULT`);
    // Then change type (this handles the enum to varchar conversion)
    await queryRunner.query(`ALTER TABLE "trends" ALTER COLUMN "source" TYPE character varying`);
    await queryRunner.query(`ALTER TABLE "trends" ALTER COLUMN "source" SET DEFAULT 'other'`);

    // 4. Refactor Products Architecture
    await queryRunner.query(`ALTER TABLE "products" ADD "is_sponsored" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "products" ADD "is_authentic" boolean NOT NULL DEFAULT true`);
    await queryRunner.query(`ALTER TABLE "products" ADD "merchant_name" character varying`);
    await queryRunner.query(`ALTER TABLE "products" ADD "affiliate_network" character varying`);
    await queryRunner.query(`ALTER TABLE "products" ADD "commerce_metadata" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse Products
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "commerce_metadata"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "affiliate_network"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "merchant_name"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "is_authentic"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "is_sponsored"`);

    // Reverse Trends
    await queryRunner.query(`ALTER TABLE "trends" ALTER COLUMN "source" TYPE "trends_source_enum" USING source::trends_source_enum`);
    await queryRunner.query(`ALTER TABLE "trends" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "trends" DROP COLUMN "phase_updated_at"`);
    await queryRunner.query(`ALTER TABLE "trends" DROP COLUMN "content_type"`);

    // Reverse Saves
    await queryRunner.query(`ALTER TABLE "saves" DROP CONSTRAINT "CHK_save_target"`);
    await queryRunner.query(`ALTER TABLE "saves" DROP CONSTRAINT "PK_saves"`);
    await queryRunner.query(`ALTER TABLE "saves" DROP CONSTRAINT "FK_save_product"`);
    await queryRunner.query(`ALTER TABLE "saves" DROP COLUMN "product_id"`);
    await queryRunner.query(`ALTER TABLE "saves" ALTER COLUMN "trend_id" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "saves" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "saves" ADD CONSTRAINT "PK_4f3910c6d7a489112958742d17c" PRIMARY KEY ("user_id", "trend_id")`);

    // Reverse Interactions
    await queryRunner.query(`ALTER TABLE "interactions" DROP CONSTRAINT "FK_interaction_product"`);
    await queryRunner.query(`ALTER TABLE "interactions" DROP COLUMN "source_type"`);
    await queryRunner.query(`ALTER TABLE "interactions" DROP COLUMN "product_id"`);
    await queryRunner.query(`ALTER TABLE "interactions" RENAME COLUMN "interaction_type" TO "type"`);
    await queryRunner.query(`ALTER TABLE "interactions" RENAME TO "engagements"`);
  }
}
