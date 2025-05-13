import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { config } from 'dotenv'
import { getFunctions } from './functions'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

// config({ path: '.env' })

export const dbInsights = (databaseName: string) => {
  const PG_HOST = process.env.PG_HOST
  const PG_USER = process.env.PG_USER
  const PG_PASSWORD = process.env.PG_PASSWORD
  const dbName = `team_${databaseName}_insights`
  const dbUrl = `postgres://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:5432/${dbName}`
  const pool = new Pool({ connectionString: dbUrl })
  const db = drizzle(pool)
  return getFunctions(db)
}
