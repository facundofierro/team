import { drizzle } from 'drizzle-orm/neon-http'
import { neon, NeonQueryFunction } from '@neondatabase/serverless'
import { config } from 'dotenv'
import { getFunctions } from './functions'

// config({ path: '.env' })

export const dbInsights = (databaseName: string) => {
  const sql: NeonQueryFunction<boolean, boolean> = neon(
    process.env[`TEAM_${databaseName.toUpperCase()}_URL`]!
  )

  const db = drizzle(sql)
  return getFunctions(db)
}
