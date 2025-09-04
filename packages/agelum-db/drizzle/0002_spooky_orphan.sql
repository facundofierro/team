ALTER TABLE "agency"."agent" ADD COLUMN "active_conversation_id" text;--> statement-breakpoint
ALTER TABLE "agency"."agent" ADD COLUMN "last_messages" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "agency"."agent" ADD COLUMN "last_conversation_updated_at" timestamp;