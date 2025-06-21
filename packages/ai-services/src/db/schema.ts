import { integer, jsonb, pgSchema, varchar } from 'drizzle-orm/pg-core'

export const aiSchema = pgSchema('ai')

export const models = aiSchema.table('models', {
  id: varchar('id', { length: 256 }).primaryKey(),
  displayName: varchar('display_name', { length: 256 }).notNull(),
  provider: varchar('provider', { length: 256 }).notNull(),
  model: varchar('model', { length: 256 }).notNull(),
  feature: varchar('feature', { length: 256 }).notNull(),
  subfeature: varchar('subfeature', { length: 256 }).notNull(),
  connection: varchar('connection', { length: 256 }).notNull(),
  featureOptions: jsonb('feature_options'),
  availableModels: jsonb('available_models'),
  priority: integer('priority').default(0).notNull(),
})
