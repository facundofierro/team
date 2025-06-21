ALTER TABLE "ai"."models" ADD COLUMN "feature_options" jsonb;--> statement-breakpoint
ALTER TABLE "ai"."models" ADD COLUMN "priority" integer DEFAULT 0 NOT NULL;