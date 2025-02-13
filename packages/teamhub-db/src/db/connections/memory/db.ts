import { drizzle } from 'drizzle-orm/neon-http'
import { neon, NeonQueryFunction } from '@neondatabase/serverless'
import { config } from 'dotenv'
import * as schema from './schema'
import { getFunctions } from './functions'

config({ path: '.env' }) // or .env.local

export const dbMemories = (databaseName: string) => {
  const sql: NeonQueryFunction<boolean, boolean> = neon(
    process.env[`TEAM${databaseName}_MEM_URL`]!
  )

  const db = drizzle(sql, { schema })

  return getFunctions(db)
}
