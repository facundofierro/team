-- Add conversation state fields to agent table
ALTER TABLE "agency"."agent"
ADD COLUMN "active_conversation_id" text,
ADD COLUMN "last_messages" jsonb DEFAULT '[]'::jsonb,
ADD COLUMN "last_conversation_updated_at" timestamp;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS "agent_active_conversation_idx" ON "agency"."agent"("active_conversation_id");

-- Add comment for documentation
COMMENT ON COLUMN "agency"."agent"."active_conversation_id" IS 'ID of the currently active conversation for this agent';
COMMENT ON COLUMN "agency"."agent"."last_messages" IS 'Last 2 messages from the active conversation for quick loading';
COMMENT ON COLUMN "agency"."agent"."last_conversation_updated_at" IS 'Timestamp when the conversation state was last updated';
