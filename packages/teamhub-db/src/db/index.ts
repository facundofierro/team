//import { sql } from '@vercel/postgres'
//import { drizzle } from 'drizzle-orm/vercel-postgres'
import * as schema from './schema'
import * as agencyFunctions from './functions/agency'
import * as t from './types'

import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { config } from 'dotenv'
import { ensureMainDatabaseAndSchemas } from './functions/utils/database'
import { createReactiveDb } from '@drizzle/reactive'

// config({ path: '.env' }) // or .env.local
// await ensureMainDatabaseAndSchemas()

const PG_HOST = process.env.PG_HOST
const PG_USER = process.env.PG_USER
const PG_PASSWORD = process.env.PG_PASSWORD
const PG_DATABASE = process.env.PG_DATABASE || 'teamhub'
const mainDbUrl = `postgres://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:5432/${PG_DATABASE}`
const pool = new Pool({ connectionString: mainDbUrl })

// Reactive configuration for main database
const reactiveConfig = {
  relations: {
    // When agent changes, invalidate these queries
    agent: ['organization.id', 'message.fromAgentId', 'message.toAgentId'],

    // When organization changes, invalidate these queries
    organization: ['agent.organizationId', 'tool.organizationId'],

    // When message changes, invalidate these queries
    message: ['agent.fromAgentId', 'agent.toAgentId'],

    // When tool changes, invalidate these queries
    tool: ['organization.id'],

    // When user changes, invalidate these queries
    user: ['organization.userId'],

    // When message type changes, invalidate these queries
    message_type: ['organization.id'],

    // When tool type changes, invalidate these queries
    tool_type: [],

    // When cron changes, invalidate these queries
    cron: ['organization.id', 'message.messageId'],
  },
  realtime: {
    enabled: true,
    transport: 'sse' as const,
    redis: {
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    },
  },
}

const drizzleDb = drizzle(pool, { schema })

// Create reactive database instance
export const reactiveDb = createReactiveDb(drizzleDb, reactiveConfig)

// Export the original Drizzle instance for legacy functions
export const db = drizzleDb

// Export the enhanced db with functions as default
export default {
  t,
  ...agencyFunctions,
}

export { dbInsights } from './connections/insights/db'
export { dbEmbeddings } from './connections/embeddings/db'
export { dbMemories } from './connections/memory/db'

export { authAdapter } from './authAdapter'

export * from './schema'
export * from './functions/agency'
export * from './functions/auth'
export * from './functions/utils/database'
export * from './types'
export * from './constants'

export * from './connections/memory/types'
export * from './connections/embeddings/types'
