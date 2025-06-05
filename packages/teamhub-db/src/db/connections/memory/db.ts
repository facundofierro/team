import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { config } from 'dotenv'
import * as schema from './schema'
import { getFunctions } from './functions'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { ensureOrgTablesExist } from '../../../db/functions/utils/database'

// config({ path: '.env' }) // or .env.local

export const dbMemories = async (databaseName: string) => {
  const PG_HOST = process.env.PG_HOST
  const PG_USER = process.env.PG_USER
  const PG_PASSWORD = process.env.PG_PASSWORD
  // Use the organization database name directly, not with _mem suffix
  const dbName = databaseName
  const dbUrl = `postgres://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:5432/${dbName}`

  // Ensure tables exist before connecting
  try {
    await ensureOrgTablesExist(dbName)
  } catch (error) {
    console.warn(`Could not ensure tables for ${dbName}:`, error)
  }

  const pool = new Pool({ connectionString: dbUrl })
  const db = drizzle(pool, { schema })

  return getFunctions(db)
}
