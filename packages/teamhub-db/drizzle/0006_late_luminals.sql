ALTER TABLE "insights"."contact" ADD COLUMN "organization_id" text;--> statement-breakpoint
ALTER TABLE "insights"."document" ADD COLUMN "organization_id" text;--> statement-breakpoint
ALTER TABLE "insights"."market" ADD COLUMN "organization_id" text;--> statement-breakpoint
ALTER TABLE "insights"."prospect_event" ADD COLUMN "organization_id" text;--> statement-breakpoint
ALTER TABLE "insights"."prospect" ADD COLUMN "organization_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "insights"."contact" ADD CONSTRAINT "contact_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "agency"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "insights"."document" ADD CONSTRAINT "document_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "agency"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "insights"."market" ADD CONSTRAINT "market_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "agency"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "insights"."prospect_event" ADD CONSTRAINT "prospect_event_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "agency"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "insights"."prospect" ADD CONSTRAINT "prospect_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "agency"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
