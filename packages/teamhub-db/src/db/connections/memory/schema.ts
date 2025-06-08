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

// Define the memory schema
const memorySchema = pgSchema('memory')

// Define custom vector type
const vector = customType<{ data: number[] }>({
  dataType() {
    return 'vector'
  },
  toDriver(value: number[]): string {
    return `[${value.join(',')}]`
  },
})

// Unified memory table - stores everything from conversations to individual facts
export const memory = memorySchema.table(
  'memory',
  {
    id: text('id').primaryKey(),
    agentId: text('agent_id').notNull(),
    agentCloneId: text('agent_clone_id'),

    // Memory type and categorization
    type: text('type').notNull(), // 'conversation', 'fact', 'preference', 'skill', 'context', 'task'
    category: text('category').notNull(), // More specific: 'chat', 'work_preference', 'technical_skill', etc.

    // Content storage - flexible for different memory types
    title: text('title').notNull(), // Conversation title or fact description
    content: jsonb('content').notNull(), // Full conversation array OR single fact object
    summary: text('summary'), // Brief description or the fact itself
    description: text('description'), // What info can be found here

    // Semantic and structural data
    keyTopics: jsonb('key_topics'), // Array of topics/entities
    tags: jsonb('tags'), // User or auto-generated tags
    embedding: vector('embedding'), // For semantic search (optional - only when pgvector available)

    // Memory metadata and importance
    importance: integer('importance').default(1), // 1-10 scale
    messageCount: integer('message_count').default(1), // 1 for facts, N for conversations
    participantIds: jsonb('participant_ids'), // Array of user/agent IDs involved

    // Conversation lifecycle flags
    isActive: boolean('is_active').default(false), // True for currently active conversation
    needsBrief: boolean('needs_brief').default(true), // True when conversation needs summary generation

    // Usage and lifecycle tracking
    accessCount: integer('access_count').default(0),
    lastAccessedAt: timestamp('last_accessed_at'),
    status: text('status').default('active'), // 'active', 'archived', 'deleted'

    // Timestamps
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    expiresAt: timestamp('expires_at'),
  },
  (memory) => ({
    // Core indexes for filtering
    agentTypeIdx: index('memory_agent_type_idx').on(
      memory.agentId,
      memory.type
    ),
    agentCategoryIdx: index('memory_agent_category_idx').on(
      memory.agentId,
      memory.category
    ),
    agentStatusIdx: index('memory_agent_status_idx').on(
      memory.agentId,
      memory.status
    ),
    agentCloneIdx: index('memory_agent_clone_idx').on(
      memory.agentId,
      memory.agentCloneId
    ),

    // Conversation-specific indexes
    agentActiveIdx: index('memory_agent_active_idx').on(
      memory.agentId,
      memory.isActive
    ),
    agentNeedsBriefIdx: index('memory_agent_needs_brief_idx').on(
      memory.agentId,
      memory.needsBrief
    ),

    // Performance indexes
    importanceIdx: index('memory_importance_idx').on(memory.importance),
    lastAccessIdx: index('memory_last_access_idx').on(memory.lastAccessedAt),
    createdAtIdx: index('memory_created_at_idx').on(memory.createdAt),

    // Semantic search
    embeddingIdx: index('memory_embedding_idx').on(memory.embedding),
  })
)

// Relations
export const memoryRelations = relations(memory, ({ one }) => ({
  conversation: one(memory, {
    fields: [memory.id],
    references: [memory.id],
  }),
}))
