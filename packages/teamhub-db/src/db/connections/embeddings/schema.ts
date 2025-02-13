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

// Define custom vector type
const vector = customType<{ data: number[] }>({
  dataType() {
    return 'vector'
  },
  toDriver(value: number[]): string {
    return `[${value.join(',')}]`
  },
})

// Embeddings table
export const embedding = pgTable(
  'embedding',
  {
    id: text('id').primaryKey(),
    type: text('type').notNull(),
    referenceId: text('reference_id').notNull(),
    vector: vector('vector').notNull(),
    version: text('version').notNull(),
    model: text('model').notNull(),
    dimension: integer('dimension').notNull(),
    isDeleted: boolean('is_deleted').default(false),
    metadata: jsonb('metadata').default({}),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    vectorIdx: index('vector_idx').on(table.vector),
  })
)
