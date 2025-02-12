CREATE TABLE IF NOT EXISTS "agency"."organization" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "agency"."agent" ADD COLUMN "organization_id" text;--> statement-breakpoint
ALTER TABLE "agency"."cron" ADD COLUMN "organization_id" text;--> statement-breakpoint
ALTER TABLE "agency"."embedding" ADD COLUMN "organization_id" text;--> statement-breakpoint
ALTER TABLE "agency"."memory" ADD COLUMN "organization_id" text;--> statement-breakpoint
ALTER TABLE "agency"."message_type" ADD COLUMN "organization_id" text;--> statement-breakpoint
ALTER TABLE "agency"."message" ADD COLUMN "organization_id" text;--> statement-breakpoint
ALTER TABLE "agency"."tool" ADD COLUMN "organization_id" text;--> statement-breakpoint
ALTER TABLE "auth"."users" ADD COLUMN "organizations" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "auth"."users" ADD COLUMN "metadata" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
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
 ALTER TABLE "agency"."embedding" ADD CONSTRAINT "embedding_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "agency"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agency"."memory" ADD CONSTRAINT "memory_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "agency"."organization"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "agency"."tool" ADD CONSTRAINT "tool_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "agency"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
