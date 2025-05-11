//import { sql } from '@vercel/postgres'
//import { drizzle } from 'drizzle-orm/vercel-postgres'
import * as schema from './schema'
import * as agencyFunctions from './functions/agency'
import * as t from './types'

import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { config } from 'dotenv'

// config({ path: '.env' }) // or .env.local

const sql = neon<boolean, boolean>(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })

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
