CREATE SCHEMA "ai";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai"."models" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"display_name" varchar(256) NOT NULL,
	"provider" varchar(256) NOT NULL,
	"model" varchar(256) NOT NULL,
	"feature" varchar(256) NOT NULL,
	"subfeature" varchar(256) NOT NULL,
	"gateway" varchar(256) NOT NULL,
	"feature_options" jsonb,
	"available_models" jsonb,
	"priority" integer DEFAULT 0 NOT NULL
);
