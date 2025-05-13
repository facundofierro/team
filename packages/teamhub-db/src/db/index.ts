//import { sql } from '@vercel/postgres'
//import { drizzle } from 'drizzle-orm/vercel-postgres'
import * as schema from './schema'
import * as agencyFunctions from './functions/agency'
import * as t from './types'

import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { config } from 'dotenv'
import { ensureMainDatabaseAndSchemas } from './functions/utils/database'

// config({ path: '.env' }) // or .env.local

// await ensureMainDatabaseAndSchemas()

const PG_HOST = process.env.PG_HOST
const PG_USER = process.env.PG_USER
const PG_PASSWORD = process.env.PG_PASSWORD
const PG_DATABASE = process.env.PG_DATABASE || 'teamhub'
const mainDbUrl = `postgres://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:5432/${PG_DATABASE}`
const pool = new Pool({ connectionString: mainDbUrl })
export const db = drizzle(pool, { schema })

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
export * from './types'
export * from './constants'

export * from './connections/memory/types'
export * from './connections/embeddings/types'
