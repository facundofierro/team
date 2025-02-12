ALTER TABLE "auth"."accounts" DROP CONSTRAINT "accounts_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "insights"."contact" DROP CONSTRAINT "contact_prospect_id_prospect_id_fk";
--> statement-breakpoint
ALTER TABLE "agency"."cron" DROP CONSTRAINT "cron_message_id_message_id_fk";
--> statement-breakpoint
ALTER TABLE "agency"."memory" DROP CONSTRAINT "memory_agent_id_agent_id_fk";
--> statement-breakpoint
ALTER TABLE "agency"."message" DROP CONSTRAINT "message_from_agent_id_agent_id_fk";
--> statement-breakpoint
ALTER TABLE "insights"."prospect_event" DROP CONSTRAINT "prospect_event_prospect_id_prospect_id_fk";
--> statement-breakpoint
ALTER TABLE "insights"."prospect" DROP CONSTRAINT "prospect_agent_id_agent_id_fk";
--> statement-breakpoint
ALTER TABLE "auth"."sessions" DROP CONSTRAINT "sessions_user_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth"."accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
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
 ALTER TABLE "agency"."message" ADD CONSTRAINT "message_from_agent_id_agent_id_fk" FOREIGN KEY ("from_agent_id") REFERENCES "agency"."agent"("id") ON DELETE no action ON UPDATE no action;
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth"."sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
