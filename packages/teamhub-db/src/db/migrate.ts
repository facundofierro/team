import { resolve } from 'path'
import { config } from 'dotenv'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import * as mainSchema from './schema'

import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

config({ path: resolve(__dirname, '../../.env') }) // Adjust path if needed

const PG_HOST = process.env.PG_HOST
const PG_USER = process.env.PG_USER
const PG_PASSWORD = process.env.PG_PASSWORD
const MAIN_DB_NAME = 'teamhub'

const MAIN_DB_URL = `postgres://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:5432/${MAIN_DB_NAME}`

async function createDatabaseIfNotExists(
  connectionString: string,
  dbName: string
) {
  // Parse the connection string to get db name and connection info
  const { host, port, user, password } = {
    host: PG_HOST,
    port: 5432,
    user: PG_USER,
    password: PG_PASSWORD,
  }
  // Connect to the default 'postgres' db
  const adminConnectionString = `postgres://${user}:${password}@${host}:${port}/postgres`
  const client = new Pool({ connectionString: adminConnectionString })
  try {
    // Try connecting to the target db
    const testPool = new Pool({ connectionString })
    await testPool.query('SELECT 1')
    await testPool.end()
  } catch (err: any) {
    if (err.code === '3D000') {
      // Database does not exist, create it
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

async function ensureSchemasExist(connectionString: string) {
  const pool = new Pool({ connectionString })
  try {
    await pool.query('CREATE SCHEMA IF NOT EXISTS agency;')
    await pool.query('CREATE SCHEMA IF NOT EXISTS auth;')
  } finally {
    await pool.end()
  }
}

async function migrateDb(connectionString: string) {
  const pool = new Pool({ connectionString })
  const db = drizzle(pool, { schema: mainSchema })
  console.log(`Migrating main application database...`)
  await migrate(db, { migrationsFolder: './drizzle' })
  await pool.end()
}

async function main() {
  try {
    if (!PG_HOST || !PG_USER || !PG_PASSWORD) {
      throw new Error('PG_HOST, PG_USER, or PG_PASSWORD is not set')
    }
    await createDatabaseIfNotExists(MAIN_DB_URL, MAIN_DB_NAME)
    await ensureSchemasExist(MAIN_DB_URL)
    await migrateDb(MAIN_DB_URL)
    console.log('All migrations completed!')
  } catch (error) {
    console.error('Error performing migrations:', error)
    process.exit(1)
  }
}

main()
