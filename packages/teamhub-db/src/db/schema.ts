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

// Define schemas
const agency = pgSchema('agency')
const insights = pgSchema('insights')
const auth = pgSchema('auth')

// Define custom vector type
const vector = customType<{ data: number[] }>({
  dataType() {
    return 'vector'
  },
  toDriver(value: number[]): string {
    return `[${value.join(',')}]`
  },
})

// Add this function at the top
const generateId = () => Math.random().toString(36).substring(2, 9)

export const organization = agency.table('organization', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  userId: text('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Agent table
export const agents = agency.table('agent', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').references(() => organization.id),
  name: text('name').notNull(),
  role: text('role').notNull(),
  doesClone: boolean('does_clone').default(false).notNull(),
  parentId: text('parentId'),
  systemPrompt: text('system_prompt').default(''),
  maxInstances: integer('max_instances').default(1),
  policyDefinitions: jsonb('policy_definitions')
    .$type<Record<string, unknown>>()
    .default({}),
  memoryRules: jsonb('memory_rules')
    .$type<Record<string, unknown>>()
    .default({}),
  toolPermissions: jsonb('tool_permissions')
    .$type<Record<string, unknown>>()
    .default({}),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  isActive: boolean('is_active').default(true).notNull(),
})

// Message table (for communication between agents)
export const messages = agency.table('message', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').references(() => organization.id),
  fromAgentId: text('from_agent_id').references(() => agents.id),
  toAgentId: text('to_agent_id').references(() => agents.id),
  toAgentCloneId: text('to_agent_clone_id').references(() => agents.id),
  type: text('type').notNull(),
  content: text('content'),
  metadata: jsonb('metadata').default({}), // MessageMetadata
  status: text('status').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  completedAt: timestamp('completed_at'),
})

// Message type table
export const messageType = agency.table('message_type', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').references(() => organization.id),
  name: text('name').notNull(),
  kind: text('kind').notNull(),
  description: text('description'),
  contentType: text('content_type').notNull(),
  contentSchema: jsonb('content_schema').notNull(), // MetadataSchema
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
})

// Memory table (chat/interaction history)
export const memory = agency.table(
  'memory',
  {
    id: text('id').primaryKey(),
    organizationId: text('organization_id').references(() => organization.id),
    agentId: text('agent_id').references(() => agents.id),
    agentCloneId: text('agent_clone_id').references(() => agents.id),
    messageId: text('message_id').references(() => messages.id),
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

// Tool table
export const toolTypes = agency.table('tool_type', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  description: text('description'),
  canBeManaged: boolean('can_be_managed').notNull().default(false),
  managedPrice: integer('managed_price').notNull().default(0),
  managedPriceDescription: text('managed_price_description'),
  configurationParams: jsonb('configuration_params').notNull(),
  monthlyUsage: integer('monthly_usage').notNull().default(0),
  allowedUsage: integer('allowed_usage').notNull().default(0),
  allowedTimeStart: text('allowed_time_start').notNull().default('00:00'),
  allowedTimeEnd: text('allowed_time_end').notNull().default('23:59'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
})

export const tools = agency.table('tool', {
  id: text('id').primaryKey(), // textId for automatic insertion
  organizationId: text('organization_id').references(() => organization.id),
  type: text('type').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  configuration: jsonb('configuration').notNull(), // Parameters schema
  schema: jsonb('schema').notNull(), // Parameters schema
  metadata: jsonb('metadata').default({}),
  version: text('version').notNull(),
  isActive: boolean('is_active').default(true),
  isManaged: boolean('is_managed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

// Cron table
export const cron = agency.table('cron', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').references(() => organization.id),
  messageId: text('message_id').references(() => messages.id),
  schedule: text('schedule').notNull(), // Cron expression
  isActive: boolean('is_active').default(true),
  lastRun: timestamp('last_run'),
  nextRun: timestamp('next_run'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Embeddings table
export const embedding = agency.table(
  'embedding',
  {
    id: text('id').primaryKey(),
    organizationId: text('organization_id').references(() => organization.id),
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

// Relations
export const agent_relations = relations(agents, ({ one, many }) => ({
  parent: one(agents, {
    fields: [agents.parentId],
    references: [agents.id],
  }),
}))

export const message_relations = relations(messages, ({ one, many }) => ({
  fromAgent: one(agents, {
    fields: [messages.fromAgentId],
    references: [agents.id],
  }),
  toAgent: one(agents, {
    fields: [messages.toAgentId],
    references: [agents.id],
  }),
  memories: many(memory),
}))

// Insight tables
export const documents = insights.table('document', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').references(() => organization.id),
  type: text('type').notNull(), // 'company_info', 'product', 'marketing_plan', etc.
  title: text('title').notNull(),
  content: text('content').notNull(),
  metadata: jsonb('metadata').default({}),
  version: text('version').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const prospects = insights.table('prospect', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').references(() => organization.id),
  agentId: text('agent_id').references(() => agents.id),
  name: text('name').notNull(),
  company: text('company'),
  status: text('status').notNull(),
  score: integer('score'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const prospectEvents = insights.table('prospect_event', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').references(() => organization.id),
  prospectId: text('prospect_id').references(() => prospects.id),
  type: text('type').notNull(),
  description: text('description'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow(),
})

export const contact = insights.table(
  'contact',
  {
    id: text('id').primaryKey(),
    organizationId: text('organization_id').references(() => organization.id),
    prospectId: text('prospect_id').references(() => prospects.id),
    type: text('type').notNull().default('email'),
    value: text('value').notNull(),
  },
  (table) => ({
    prospectTypeIdx: index('prospect_type_idx').on(table.type, table.value),
    prospectValueIdx: index('prospect_value_idx').on(table.value),
  })
)

export const markets = insights.table('market', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').references(() => organization.id),
  name: text('name').notNull(),
  description: text('description'),
  segment: text('segment').notNull(),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Auth tables
export const users = auth.table('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId()),
  name: text('name'),
  organizationId: text('organization_id'),
  metadata: jsonb('metadata').default({}),
  email: text('email').unique(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
})

export const accounts = auth.table('accounts', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  refresh_token: text('refresh_token'),
  token_type: text('token_type'),
  scope: text('scope'),
})

export const sessions = auth.table('sessions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
  sessionToken: text('session_token').notNull().unique(),
})

export const verificationTokens = auth.table('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})
