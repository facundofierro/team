import { resolve } from 'path'
import { config } from 'dotenv'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import * as mainSchema from './schema'

import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { parse as parsePgConnectionString } from 'pg-connection-string'

config({ path: resolve(__dirname, '../../.env') }) // Adjust path if needed

async function migrateDb(connectionString: string, label: string) {
  const pool = new Pool({ connectionString })
  const db = drizzle(pool, { schema: mainSchema })
  console.log(`Migrating ${label} database...`)
  await migrate(db, { migrationsFolder: './drizzle' })
  await pool.end()
}

async function createDatabaseIfNotExists(connectionString: string) {
  // Parse the connection string to get db name and connection info
  const parsed = parsePgConnectionString(connectionString)
  const { host, port, user, password, database } = parsed
  // Connect to the default 'postgres' db
  const adminConnectionString = `postgres://${user}:${password}@${host}:$${
    port || 5432
  }/postgres`
  console.log(
    '[DEBUG] Attempting admin connection with:',
    adminConnectionString
  )
  const client = new Pool({ connectionString: adminConnectionString })
  try {
    // Try connecting to the target db
    const testPool = new Pool({ connectionString })
    await testPool.query('SELECT 1')
    await testPool.end()
  } catch (err: any) {
    if (err.code === '3D000') {
      // Database does not exist, create it
      const dbName = database
      console.log(`Database ${dbName} does not exist. Creating...`)
      await client.query(`CREATE DATABASE "${dbName}"`)
      console.log(`Database ${dbName} created.`)
    } else {
      throw err
    }
  } finally {
    await client.end()
  }
}

async function main() {
  try {
    if (!process.env.PG_AGENCY_URL || !process.env.PG_AUTH_URL) {
      throw new Error('PG_AGENCY_URL or PG_AUTH_URL is not set')
    }
    console.log('[DEBUG] PG_AGENCY_URL:', process.env.PG_AGENCY_URL)
    console.log('[DEBUG] PG_AUTH_URL:', process.env.PG_AUTH_URL)
    await createDatabaseIfNotExists(process.env.PG_AGENCY_URL)
    await createDatabaseIfNotExists(process.env.PG_AUTH_URL)
    await migrateDb(process.env.PG_AGENCY_URL, 'agency')
    await migrateDb(process.env.PG_AUTH_URL, 'auth')
    console.log('All migrations completed!')
  } catch (error) {
    console.error('Error performing migrations:', error)
    if (process.env.PG_AGENCY_URL)
      console.error('[DEBUG] PG_AGENCY_URL:', process.env.PG_AGENCY_URL)
    if (process.env.PG_AUTH_URL)
      console.error('[DEBUG] PG_AUTH_URL:', process.env.PG_AUTH_URL)
    process.exit(1)
  }
}

main()

export const agencyDb = drizzle(
  new Pool({ connectionString: process.env.PG_AGENCY_URL! }),
  { schema: mainSchema }
)
export const authDb = drizzle(
  new Pool({ connectionString: process.env.PG_AUTH_URL! }),
  { schema: mainSchema }
)
