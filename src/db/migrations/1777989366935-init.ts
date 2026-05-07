import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1777989366935 implements MigrationInterface {
  name = "Init1777989366935";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "trend_content" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "trend_id" uuid NOT NULL, "content_url" character varying NOT NULL, "content_type" character varying NOT NULL, "is_primary" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_0cda73a9717c8e71262070456e8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "trend_metadata" ("trend_id" uuid NOT NULL, "tags" text array NOT NULL DEFAULT '{}', "categories" text array NOT NULL DEFAULT '{}', "sentiment_score" numeric(5,2), "ai_summary" text, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c93d506d63381dc93d7e7f93970" PRIMARY KEY ("trend_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "engagements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid, "trend_id" uuid, "type" character varying NOT NULL, "content" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_aec8c95c82a37a5791001cdb9ae" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TABLE "saves" ("user_id" uuid NOT NULL, "trend_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b0ac3df08c51a42216cab1bf03a" PRIMARY KEY ("user_id", "trend_id"))`);
    await queryRunner.query(`CREATE TABLE "clickouts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid, "product_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b9728b12c76283e6d10c6e8ec1e" PRIMARY KEY ("id"))`);
    await queryRunner.query(
      `CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "trend_id" uuid, "name" character varying NOT NULL, "description" text, "price" numeric(12,2), "currency" character varying NOT NULL DEFAULT 'USD', "affiliate_url" character varying NOT NULL, "image_url" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ai_analysis" ("trend_id" uuid NOT NULL, "raw_analysis" jsonb, "refined_summary" text, "keywords" text array NOT NULL DEFAULT '{}', "vision_data" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_69c631f5fda6aca486c8a0ad0f2" PRIMARY KEY ("trend_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "trend_scores" ("trend_id" uuid NOT NULL, "score" numeric(12,2) NOT NULL DEFAULT '0', "velocity" numeric(12,2) NOT NULL DEFAULT '0', "engagement_count" integer NOT NULL DEFAULT '0', "last_updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_90e3c9bf4af87bb6fb6603de6f7" PRIMARY KEY ("trend_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sponsored_content" ("trend_id" uuid NOT NULL, "advertiser_id" uuid, "budget" numeric(12,2), "bid_amount" numeric(12,2), "is_active" boolean NOT NULL DEFAULT true, "starts_at" TIMESTAMP WITH TIME ZONE, "ends_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_d2b512a8b0994f668cef59f135a" PRIMARY KEY ("trend_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "trends" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "creator_id" uuid, "title" character varying NOT NULL, "description" text, "phase" text NOT NULL DEFAULT 'emerging', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_4de18eea43d948e5ea66520e0e8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_profile" ("user_id" uuid NOT NULL, "username" character varying, "full_name" character varying, "avatar_url" character varying, "trend_score" numeric(10,2) NOT NULL DEFAULT '0', "level" integer NOT NULL DEFAULT '1', "badges" text array NOT NULL DEFAULT '{}', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_622345c51168e12eba4225a0217" UNIQUE ("username"), CONSTRAINT "PK_eee360f3bff24af1b6890765201" PRIMARY KEY ("user_id"))`,
    );
    await queryRunner.query(`ALTER TABLE "trend_content" ADD CONSTRAINT "FK_c0b9957652af1b1d90314881d9d" FOREIGN KEY ("trend_id") REFERENCES "trends"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "trend_metadata" ADD CONSTRAINT "FK_c93d506d63381dc93d7e7f93970" FOREIGN KEY ("trend_id") REFERENCES "trends"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "engagements" ADD CONSTRAINT "FK_71cbd6326f8458df431fbc4efb7" FOREIGN KEY ("user_id") REFERENCES "user_profile"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "engagements" ADD CONSTRAINT "FK_b5e854e08e5e0cf596b0a2e5e5d" FOREIGN KEY ("trend_id") REFERENCES "trends"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "saves" ADD CONSTRAINT "FK_7b8bc823fd09b6b5751919d4a60" FOREIGN KEY ("user_id") REFERENCES "user_profile"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "saves" ADD CONSTRAINT "FK_dbbc0f92c226a7590f0e468aff8" FOREIGN KEY ("trend_id") REFERENCES "trends"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "clickouts" ADD CONSTRAINT "FK_2a9a65f1eff61bef6c89e3f6ca7" FOREIGN KEY ("user_id") REFERENCES "user_profile"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "clickouts" ADD CONSTRAINT "FK_21d5402615f2a6ec059af906b02" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ae29cd45b63989d33b1c5fa588d" FOREIGN KEY ("trend_id") REFERENCES "trends"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "ai_analysis" ADD CONSTRAINT "FK_69c631f5fda6aca486c8a0ad0f2" FOREIGN KEY ("trend_id") REFERENCES "trends"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "trend_scores" ADD CONSTRAINT "FK_90e3c9bf4af87bb6fb6603de6f7" FOREIGN KEY ("trend_id") REFERENCES "trends"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "sponsored_content" ADD CONSTRAINT "FK_d2b512a8b0994f668cef59f135a" FOREIGN KEY ("trend_id") REFERENCES "trends"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "sponsored_content" ADD CONSTRAINT "FK_8e105b187066e0e5ad2be737a03" FOREIGN KEY ("advertiser_id") REFERENCES "user_profile"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "trends" ADD CONSTRAINT "FK_ef311a3d72a6ea2ead36023709b" FOREIGN KEY ("creator_id") REFERENCES "user_profile"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "trends" DROP CONSTRAINT "FK_ef311a3d72a6ea2ead36023709b"`);
    await queryRunner.query(`ALTER TABLE "sponsored_content" DROP CONSTRAINT "FK_8e105b187066e0e5ad2be737a03"`);
    await queryRunner.query(`ALTER TABLE "sponsored_content" DROP CONSTRAINT "FK_d2b512a8b0994f668cef59f135a"`);
    await queryRunner.query(`ALTER TABLE "trend_scores" DROP CONSTRAINT "FK_90e3c9bf4af87bb6fb6603de6f7"`);
    await queryRunner.query(`ALTER TABLE "ai_analysis" DROP CONSTRAINT "FK_69c631f5fda6aca486c8a0ad0f2"`);
    await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ae29cd45b63989d33b1c5fa588d"`);
    await queryRunner.query(`ALTER TABLE "clickouts" DROP CONSTRAINT "FK_21d5402615f2a6ec059af906b02"`);
    await queryRunner.query(`ALTER TABLE "clickouts" DROP CONSTRAINT "FK_2a9a65f1eff61bef6c89e3f6ca7"`);
    await queryRunner.query(`ALTER TABLE "saves" DROP CONSTRAINT "FK_dbbc0f92c226a7590f0e468aff8"`);
    await queryRunner.query(`ALTER TABLE "saves" DROP CONSTRAINT "FK_7b8bc823fd09b6b5751919d4a60"`);
    await queryRunner.query(`ALTER TABLE "engagements" DROP CONSTRAINT "FK_b5e854e08e5e0cf596b0a2e5e5d"`);
    await queryRunner.query(`ALTER TABLE "engagements" DROP CONSTRAINT "FK_71cbd6326f8458df431fbc4efb7"`);
    await queryRunner.query(`ALTER TABLE "trend_metadata" DROP CONSTRAINT "FK_c93d506d63381dc93d7e7f93970"`);
    await queryRunner.query(`ALTER TABLE "trend_content" DROP CONSTRAINT "FK_c0b9957652af1b1d90314881d9d"`);
    await queryRunner.query(`DROP TABLE "user_profile"`);
    await queryRunner.query(`DROP TABLE "trends"`);
    await queryRunner.query(`DROP TABLE "sponsored_content"`);
    await queryRunner.query(`DROP TABLE "trend_scores"`);
    await queryRunner.query(`DROP TABLE "ai_analysis"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "clickouts"`);
    await queryRunner.query(`DROP TABLE "saves"`);
    await queryRunner.query(`DROP TABLE "engagements"`);
    await queryRunner.query(`DROP TABLE "trend_metadata"`);
    await queryRunner.query(`DROP TABLE "trend_content"`);
  }
}
