import { drizzle } from 'drizzle-orm/neon-http'
import { neon, NeonQueryFunction } from '@neondatabase/serverless'
import { config } from 'dotenv'
import { getFunctions } from './functions'

config({ path: '.env' })

const sql: NeonQueryFunction<boolean, boolean> = neon(
  process.env.TEAMKADIEL_URL!
)

export const db = drizzle(sql)

export const insights = (databaseName: string) => {
  const sql: NeonQueryFunction<boolean, boolean> = neon(
    process.env[`TEAMKADIEL_${databaseName}_URL`]!
  )

  const db = drizzle(sql)
  return getFunctions(db)
}
