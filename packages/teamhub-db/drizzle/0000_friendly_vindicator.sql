CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS "agency"."agent" (
	"id" text PRIMARY KEY NOT NULL,
	"does_clone" boolean DEFAULT false,
	"parentId" text,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"system_prompt" text,
	"max_instances" integer DEFAULT 1,
	"policy_definitions" jsonb DEFAULT '{}'::jsonb,
	"memory_rules" jsonb DEFAULT '{}'::jsonb,
	"tool_permissions" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "insights"."contact" (
	"id" text PRIMARY KEY NOT NULL,
	"prospect_id" text,
	"type" text DEFAULT 'email' NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agency"."cron" (
	"id" text PRIMARY KEY NOT NULL,
	"message_id" text,
	"schedule" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"last_run" timestamp,
	"next_run" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "insights"."document" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"version" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agency"."embedding" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"reference_id" text NOT NULL,
	"vector" vector(1536) NOT NULL,
	"version" text NOT NULL,
	"model" text NOT NULL,
	"dimension" integer NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "insights"."market" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"segment" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agency"."memory" (
	"id" text PRIMARY KEY NOT NULL,
	"agent_id" text,
	"agent_clone_id" text,
	"message_id" text,
	"type" text NOT NULL,
	"category" text NOT NULL,
	"content" text,
	"structured_data" jsonb,
	"binary_data" text,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agency"."message_type" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"kind" text NOT NULL,
	"description" text,
	"content_type" text NOT NULL,
	"content_schema" jsonb NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agency"."message" (
	"id" text PRIMARY KEY NOT NULL,
	"from_agent_id" text,
	"to_agent_id" text,
	"to_agent_clone_id" text,
	"type" text NOT NULL,
	"content" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "insights"."prospect_event" (
	"id" text PRIMARY KEY NOT NULL,
	"prospect_id" text,
	"type" text NOT NULL,
	"description" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "insights"."prospect" (
	"id" text PRIMARY KEY NOT NULL,
	"agent_id" text,
	"name" text NOT NULL,
	"company" text,
	"status" text NOT NULL,
	"score" integer,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agency"."tool" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"schema" jsonb NOT NULL,
	"version" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prospect_type_idx" ON "insights"."contact" ("type","value");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prospect_value_idx" ON "insights"."contact" ("value");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "vector_idx" ON "agency"."embedding" ("vector");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "memory_agent_type_idx" ON "agency"."memory" ("agent_id","type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "memory_agent_category_idx" ON "agency"."memory" ("agent_id","category");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "insights"."contact" ADD CONSTRAINT "contact_prospect_id_prospect_id_fk" FOREIGN KEY ("prospect_id") REFERENCES "insights"."prospect"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agency"."cron" ADD CONSTRAINT "cron_message_id_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "agency"."message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agency"."memory" ADD CONSTRAINT "memory_agent_id_agent_id_fk" FOREIGN KEY ("agent_id") REFERENCES "agency"."agent"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agency"."memory" ADD CONSTRAINT "memory_agent_clone_id_agent_id_fk" FOREIGN KEY ("agent_clone_id") REFERENCES "agency"."agent"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agency"."memory" ADD CONSTRAINT "memory_message_id_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "agency"."message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agency"."message" ADD CONSTRAINT "message_from_agent_id_agent_id_fk" FOREIGN KEY ("from_agent_id") REFERENCES "agency"."agent"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agency"."message" ADD CONSTRAINT "message_to_agent_id_agent_id_fk" FOREIGN KEY ("to_agent_id") REFERENCES "agency"."agent"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agency"."message" ADD CONSTRAINT "message_to_agent_clone_id_agent_id_fk" FOREIGN KEY ("to_agent_clone_id") REFERENCES "agency"."agent"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "insights"."prospect_event" ADD CONSTRAINT "prospect_event_prospect_id_prospect_id_fk" FOREIGN KEY ("prospect_id") REFERENCES "insights"."prospect"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "insights"."prospect" ADD CONSTRAINT "prospect_agent_id_agent_id_fk" FOREIGN KEY ("agent_id") REFERENCES "agency"."agent"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
