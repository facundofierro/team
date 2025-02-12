ALTER TABLE "agency"."tool_type" ADD COLUMN "can_be_managed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "agency"."tool_type" ADD COLUMN "configuration_params" jsonb NOT NULL;