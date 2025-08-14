//import { sql } from '@vercel/postgres'
//import { drizzle } from 'drizzle-orm/vercel-postgres'
import * as schema from './schema'
import * as agencyFunctions from './functions/agency'
import * as t from './types'

import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { config } from 'dotenv'
import { ensureMainDatabaseAndSchemas } from './functions/utils/database'
import { createReactiveDb } from '@drizzle/reactive/server'

// config({ path: '.env' }) // or .env.local
// await ensureMainDatabaseAndSchemas()

// Reactive relations configuration (shared between server and client)
export const reactiveRelations = {
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
}

// Reactive configuration for main database
export const reactiveConfig = {
  relations: reactiveRelations,
  realtime: {
    enabled: true,
    transport: 'sse' as const,
    redis: {
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    },
  },
}

// Lazy initialization to avoid build-time database connection issues
let _reactiveDb: any = null
let _drizzleDb: any = null

function initializeDatabase() {
  if (_drizzleDb) return { reactiveDb: _reactiveDb, db: _drizzleDb }

  const PG_HOST = process.env.PG_HOST
  const PG_USER = process.env.PG_USER
  const PG_PASSWORD = process.env.PG_PASSWORD
  const PG_DATABASE = process.env.PG_DATABASE || 'teamhub'

  if (!PG_HOST || !PG_USER || !PG_PASSWORD) {
    console.warn(
      '⚠️ Database environment variables not available, skipping initialization'
    )
    return { reactiveDb: null, db: null }
  }

  const mainDbUrl = `postgres://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:5432/${PG_DATABASE}`
  const pool = new Pool({ connectionString: mainDbUrl })

  _drizzleDb = drizzle(pool, { schema })
  _reactiveDb = createReactiveDb(_drizzleDb, reactiveConfig)

  return { reactiveDb: _reactiveDb, db: _drizzleDb }
}

// Export getters that initialize on first access
export const reactiveDb = new Proxy({} as any, {
  get(target, prop) {
    const { reactiveDb } = initializeDatabase()
    return reactiveDb?.[prop]
  },
})

export const db = new Proxy({} as any, {
  get(target, prop) {
    const { db } = initializeDatabase()
    return db?.[prop]
  },
})

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
