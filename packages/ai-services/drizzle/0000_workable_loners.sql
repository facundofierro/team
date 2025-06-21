CREATE SCHEMA "ai";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai"."models" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"display_name" varchar(256) NOT NULL,
	"provider" varchar(256) NOT NULL,
	"model" varchar(256) NOT NULL,
	"feature" varchar(256) NOT NULL,
	"connection" varchar(256) NOT NULL
);
