ALTER TABLE "auth"."auth.sessions" RENAME TO "sessions";--> statement-breakpoint
ALTER TABLE "auth"."auth.verification_tokens" RENAME TO "verification_tokens";--> statement-breakpoint
ALTER TABLE "auth"."sessions" DROP CONSTRAINT "auth.sessions_session_token_unique";--> statement-breakpoint
ALTER TABLE "auth"."sessions" DROP CONSTRAINT "auth.sessions_user_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth"."sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "auth"."sessions" ADD CONSTRAINT "sessions_session_token_unique" UNIQUE("session_token");