import { relations } from 'drizzle-orm'
import {
  text,
  boolean,
  timestamp,
  jsonb,
  integer,
  pgSchema,
} from 'drizzle-orm/pg-core'

// Define schemas
const agency = pgSchema('agency')
const auth = pgSchema('auth')

// Add this function at the top
const generateId = () => Math.random().toString(36).substring(2, 9)

export const organization = agency.table('organization', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  userId: text('user_id').references(() => users.id),
  databaseName: text('database_name').notNull(),
  databaseUrl: text('database_url'), // optional for external connections
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

// Relations
export const agent_relations = relations(agents, ({ one, many }) => ({
  parent: one(agents, {
    fields: [agents.parentId],
    references: [agents.id],
  }),
}))

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
