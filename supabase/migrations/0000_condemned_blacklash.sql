CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE TABLE "ai_analysis" (
	"trend_id" uuid PRIMARY KEY NOT NULL,
	"raw_analysis" jsonb,
	"refined_summary" text,
	"keywords" text[] DEFAULT '{}',
	"vision_data" jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "clickouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"product_id" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "engagements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"trend_id" uuid,
	"type" text NOT NULL,
	"content" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trend_id" uuid,
	"name" text NOT NULL,
	"description" text,
	"price" numeric(12, 2),
	"currency" text DEFAULT 'USD',
	"affiliate_url" text NOT NULL,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "saves" (
	"user_id" uuid,
	"trend_id" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "saves_user_id_trend_id_pk" PRIMARY KEY("user_id","trend_id")
);
--> statement-breakpoint
CREATE TABLE "sponsored_content" (
	"trend_id" uuid PRIMARY KEY NOT NULL,
	"advertiser_id" uuid,
	"budget" numeric(12, 2),
	"bid_amount" numeric(12, 2),
	"is_active" boolean DEFAULT true,
	"starts_at" timestamp with time zone,
	"ends_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trend_content" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trend_id" uuid,
	"content_url" text NOT NULL,
	"content_type" text NOT NULL,
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trend_metadata" (
	"trend_id" uuid PRIMARY KEY NOT NULL,
	"tags" text[] DEFAULT '{}',
	"categories" text[] DEFAULT '{}',
	"sentiment_score" numeric(5, 2),
	"ai_summary" text,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trend_scores" (
	"trend_id" uuid PRIMARY KEY NOT NULL,
	"score" numeric(12, 2) DEFAULT '0',
	"velocity" numeric(12, 2) DEFAULT '0',
	"engagement_count" integer DEFAULT 0,
	"last_updated" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trends" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"phase" text DEFAULT 'emerging',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_profile" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"username" text,
	"full_name" text,
	"avatar_url" text,
	"trend_score" numeric(10, 2) DEFAULT '0',
	"level" integer DEFAULT 1,
	"badges" text[] DEFAULT '{}',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "user_profile_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "auth"."users" (
	"id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_analysis" ADD CONSTRAINT "ai_analysis_trend_id_trends_id_fk" FOREIGN KEY ("trend_id") REFERENCES "public"."trends"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clickouts" ADD CONSTRAINT "clickouts_user_id_user_profile_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profile"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clickouts" ADD CONSTRAINT "clickouts_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "engagements" ADD CONSTRAINT "engagements_user_id_user_profile_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "engagements" ADD CONSTRAINT "engagements_trend_id_trends_id_fk" FOREIGN KEY ("trend_id") REFERENCES "public"."trends"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_trend_id_trends_id_fk" FOREIGN KEY ("trend_id") REFERENCES "public"."trends"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saves" ADD CONSTRAINT "saves_user_id_user_profile_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saves" ADD CONSTRAINT "saves_trend_id_trends_id_fk" FOREIGN KEY ("trend_id") REFERENCES "public"."trends"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsored_content" ADD CONSTRAINT "sponsored_content_trend_id_trends_id_fk" FOREIGN KEY ("trend_id") REFERENCES "public"."trends"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsored_content" ADD CONSTRAINT "sponsored_content_advertiser_id_user_profile_user_id_fk" FOREIGN KEY ("advertiser_id") REFERENCES "public"."user_profile"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trend_content" ADD CONSTRAINT "trend_content_trend_id_trends_id_fk" FOREIGN KEY ("trend_id") REFERENCES "public"."trends"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trend_metadata" ADD CONSTRAINT "trend_metadata_trend_id_trends_id_fk" FOREIGN KEY ("trend_id") REFERENCES "public"."trends"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trend_scores" ADD CONSTRAINT "trend_scores_trend_id_trends_id_fk" FOREIGN KEY ("trend_id") REFERENCES "public"."trends"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trends" ADD CONSTRAINT "trends_creator_id_user_profile_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user_profile"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;