import { resolve } from 'path'
import { config } from 'dotenv'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import * as mainSchema from './schema'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { log } from '@repo/logger'

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
      log.teamhubDb.migration.info(
        'Database does not exist, creating...',
        undefined,
        {
          database: dbName,
          host,
          port,
        }
      )
      await client.query(`CREATE DATABASE "${dbName}"`)
      log.teamhubDb.migration.info('Database created successfully', undefined, {
        database: dbName,
      })
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
    log.teamhubDb.schema.info('Database schemas ensured', undefined, {
      schemas: ['agency', 'auth'],
    })
  } finally {
    await pool.end()
  }
}

async function migrateDb(connectionString: string) {
  const pool = new Pool({ connectionString })
  const db = drizzle(pool, { schema: mainSchema })
  log.teamhubDb.migration.info(
    'Starting main application database migration',
    undefined,
    {
      database: MAIN_DB_NAME,
    }
  )
  await migrate(db, { migrationsFolder: './drizzle' })
  await pool.end()
}

async function main() {
  try {
    if (!PG_HOST || !PG_USER || !PG_PASSWORD) {
      throw new Error('PG_HOST, PG_USER, or PG_PASSWORD is not set')
    }

    log.teamhubDb.main.info('Starting database migration process', undefined, {
      host: PG_HOST,
      database: MAIN_DB_NAME,
      user: PG_USER,
    })

    await createDatabaseIfNotExists(MAIN_DB_URL, MAIN_DB_NAME)
    await ensureSchemasExist(MAIN_DB_URL)
    await migrateDb(MAIN_DB_URL)

    log.teamhubDb.migration.info(
      'All migrations completed successfully',
      undefined,
      {
        database: MAIN_DB_NAME,
      }
    )
  } catch (error) {
    log.teamhubDb.migration.error('Error performing migrations', undefined, {
      error: error instanceof Error ? error.message : String(error),
      database: MAIN_DB_NAME,
    })
    process.exit(1)
  }
}

main()
