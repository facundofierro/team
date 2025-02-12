CREATE TABLE IF NOT EXISTS "agency"."tool_type" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"monthly_usage" integer DEFAULT 0 NOT NULL,
	"allowed_usage" integer DEFAULT 0 NOT NULL,
	"allowed_time_start" text DEFAULT '00:00' NOT NULL,
	"allowed_time_end" text DEFAULT '23:59' NOT NULL,
	"is_active" boolean DEFAULT true,
	"managed_price" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "agency"."tool" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agency"."tool" ADD COLUMN "configuration" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "agency"."tool" ADD COLUMN "is_managed" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "auth"."users" ADD COLUMN "organization_id" text;--> statement-breakpoint
ALTER TABLE "auth"."users" DROP COLUMN IF EXISTS "organizations";