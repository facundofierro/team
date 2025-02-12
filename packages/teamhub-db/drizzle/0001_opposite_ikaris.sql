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
CREATE TABLE IF NOT EXISTS "auth"."auth.sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires" timestamp NOT NULL,
	"session_token" text NOT NULL,
	CONSTRAINT "auth.sessions_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth"."users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"email_verified" timestamp,
	"image" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth"."auth.verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "agency"."agent" ALTER COLUMN "does_clone" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "agency"."agent" ALTER COLUMN "system_prompt" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "agency"."agent" ALTER COLUMN "is_active" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "agency"."embedding" ALTER COLUMN "vector" SET DATA TYPE vector;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth"."accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth"."auth.sessions" ADD CONSTRAINT "auth.sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
