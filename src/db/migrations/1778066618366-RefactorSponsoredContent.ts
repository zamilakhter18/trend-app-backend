import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorSponsoredContent1778066618366 implements MigrationInterface {
  name = "RefactorSponsoredContent1778066618366";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create brands table
    await queryRunner.query(`
            CREATE TABLE "brands" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "verified" boolean NOT NULL DEFAULT false,
                "billing_metadata" jsonb,
                "website_url" character varying,
                "logo_url" character varying,
                "owner_id" uuid,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_brand_name" UNIQUE ("name"),
                CONSTRAINT "PK_brands" PRIMARY KEY ("id"),
                CONSTRAINT "FK_brands_owner" FOREIGN KEY ("owner_id") REFERENCES "user_profile"("user_id") ON DELETE SET NULL
            )
        `);

    // 2. Refactor sponsored_content table
    // Rename priority_score to campaign_priority
    await queryRunner.query(`ALTER TABLE "sponsored_content" RENAME COLUMN "priority_score" TO "campaign_priority"`);

    // Rename bid_amount to placement_bid
    await queryRunner.query(`ALTER TABLE "sponsored_content" RENAME COLUMN "bid_amount" TO "placement_bid"`);

    // Add brand_id column
    await queryRunner.query(`ALTER TABLE "sponsored_content" ADD "brand_id" uuid`);

    // Add foreign key for brand_id
    await queryRunner.query(`
            ALTER TABLE "sponsored_content" 
            ADD CONSTRAINT "FK_sponsored_content_brand" 
            FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE SET NULL
        `);

    // Remove old advertiser_id relation if it exists
    // First check if the constraint exists (it should based on previous entities)
    // We'll just drop the column which should drop the constraint in most PG setups if it's a simple FK
    // But to be safe, let's try to drop the constraint if we can find its name.
    // Usually it's FK_... but it depends on how it was created.
    // Let's just drop the column for now.
    await queryRunner.query(`ALTER TABLE "sponsored_content" DROP COLUMN "advertiser_id"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse changes
    await queryRunner.query(`ALTER TABLE "sponsored_content" ADD "advertiser_id" uuid`);
    await queryRunner.query(`
            ALTER TABLE "sponsored_content" 
            ADD CONSTRAINT "FK_sponsored_content_advertiser" 
            FOREIGN KEY ("advertiser_id") REFERENCES "user_profile"("user_id") ON DELETE SET NULL
        `);
    await queryRunner.query(`ALTER TABLE "sponsored_content" DROP CONSTRAINT "FK_sponsored_content_brand"`);
    await queryRunner.query(`ALTER TABLE "sponsored_content" DROP COLUMN "brand_id"`);
    await queryRunner.query(`ALTER TABLE "sponsored_content" RENAME COLUMN "placement_bid" TO "bid_amount"`);
    await queryRunner.query(`ALTER TABLE "sponsored_content" RENAME COLUMN "campaign_priority" TO "priority_score"`);
    await queryRunner.query(`DROP TABLE "brands"`);
  }
}
