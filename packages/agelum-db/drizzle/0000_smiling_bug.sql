CREATE TABLE IF NOT EXISTS "auth"."accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"access_token" text,
	"expires_at" integer,
	"refresh_token" text,
	"token_type" text,
	"scope" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agency"."agent" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"does_clone" boolean DEFAULT false NOT NULL,
	"parentId" text,
	"system_prompt" text DEFAULT '',
	"max_instances" integer DEFAULT 1,
	"policy_definitions" jsonb DEFAULT '{}'::jsonb,
	"memory_rules" jsonb DEFAULT '{}'::jsonb,
	"tool_permissions" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agency"."cron" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text,
	"message_id" text,
	"schedule" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"last_run" timestamp,
	"next_run" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agency"."message_type" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text,
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
	"organization_id" text,
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
CREATE TABLE IF NOT EXISTS "agency"."organization" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"user_id" text,
	"database_name" text NOT NULL,
	"database_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth"."sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires" timestamp NOT NULL,
	"session_token" text NOT NULL,
	CONSTRAINT "sessions_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agency"."tool_type" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"can_be_managed" boolean DEFAULT false NOT NULL,
	"managed_price" integer DEFAULT 0 NOT NULL,
	"managed_price_description" text,
	"configuration_params" jsonb NOT NULL,
	"monthly_usage" integer DEFAULT 0 NOT NULL,
	"allowed_usage" integer DEFAULT 0 NOT NULL,
	"allowed_time_start" text DEFAULT '00:00' NOT NULL,
	"allowed_time_end" text DEFAULT '23:59' NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agency"."tool" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"configuration" jsonb NOT NULL,
	"schema" jsonb NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"version" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"is_managed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth"."users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"organization_id" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"email" text,
	"email_verified" timestamp,
	"image" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth"."verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth"."accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agency"."agent" ADD CONSTRAINT "agent_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "agency"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agency"."cron" ADD CONSTRAINT "cron_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "agency"."organization"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "agency"."message_type" ADD CONSTRAINT "message_type_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "agency"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agency"."message" ADD CONSTRAINT "message_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "agency"."organization"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "agency"."organization" ADD CONSTRAINT "organization_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth"."sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agency"."tool" ADD CONSTRAINT "tool_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "agency"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
