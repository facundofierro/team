import { relations, sql } from 'drizzle-orm'
import {
  pgTable,
  text,
  boolean,
  timestamp,
  jsonb,
  integer,
  index,
  pgSchema,
  customType,
} from 'drizzle-orm/pg-core'

// Memory table (chat/interaction history)
export const memory = pgTable(
  'memory',
  {
    id: text('id').primaryKey(),
    agentId: text('agent_id'),
    agentCloneId: text('agent_clone_id'),
    messageId: text('message_id'),
    type: text('type').notNull(), // 'text', 'structured_data', 'binary'
    category: text('category').notNull(),
    content: text('content'),
    structuredData: jsonb('structured_data'),
    binaryData: text('binary_data'), // URL or reference to binary storage
    createdAt: timestamp('created_at').defaultNow(),
    expiresAt: timestamp('expires_at'),
  },
  (memory) => ({
    agentTypeIdx: index('memory_agent_type_idx').on(
      memory.agentId,
      memory.type
    ),
    agentCategoryIdx: index('memory_agent_category_idx').on(
      memory.agentId,
      memory.category
    ),
  })
)
