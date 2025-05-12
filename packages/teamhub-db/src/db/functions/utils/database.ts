import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool, Client } from 'pg'
import * as memorySchema from '../../connections/memory/schema'
import * as embeddingsSchema from '../../connections/embeddings/schema'
import * as mainSchema from '../../schema'
import { sql } from 'drizzle-orm'

// Types for database selection
export type DatabaseType = 'memory' | 'embeddings' | 'insights'

const getSchema = (type: DatabaseType) => {
  switch (type) {
    case 'memory':
      return memorySchema.memory
    case 'embeddings':
      return embeddingsSchema.embedding
    // Add case for insights if needed
    default:
      throw new Error(`Unknown schema type: ${type}`)
  }
}

// Helper to build connection string for a given org and db type
export function getConnectionString(
  orgId: string,
  dbType: DatabaseType
): string {
  const host = process.env.PG_HOST
  const user = process.env.PG_USER
  const password = process.env.PG_PASSWORD
  if (!host || !user || !password) {
    throw new Error(
      'Missing PG_HOST, PG_USER, or PG_PASSWORD environment variables'
    )
  }
  // Convention: db name is <orgId>_<dbType>_db
  const dbName = `${orgId.toLowerCase()}_${dbType}_db`
  return `postgres://${user}:${password}@${host}:5432/${dbName}`
}

// Get a drizzle-orm db instance for a given org and db type
export function getDb(orgId: string, dbType: DatabaseType) {
  const connectionString = getConnectionString(orgId, dbType)
  const pool = new Pool({ connectionString })
  const db = drizzle(pool)
  return db
}

/**
 * Create a new PostgreSQL database and optionally run a schema migration.
 * @param dbName The name of the database to create.
 * @param schemaType Optional. The schema type to migrate: 'embeddings', 'memory', or 'insights'.
 *                  For 'insights', no migration is run.
 */
export async function createDatabase(
  dbName: string,
  schemaType?: DatabaseType
) {
  // Hardcoded admin connection string (connects to 'postgres' db)
  const host = process.env.PG_HOST
  const user = process.env.PG_USER
  const password = process.env.PG_PASSWORD
  if (!host || !user || !password) {
    throw new Error(
      'Missing PG_HOST, PG_USER, or PG_PASSWORD environment variables'
    )
  }
  const adminUrl = `postgres://${user}:${password}@${host}:5432/postgres`

  const client = new Client({ connectionString: adminUrl })
  try {
    await client.connect()
    await client.query(`CREATE DATABASE "${dbName}"`)
    console.log(`Database ${dbName} created successfully.`)
  } catch (err: any) {
    if (err.code === '42P04') {
      // 42P04 is 'duplicate_database'
      console.log(`Database ${dbName} already exists.`)
    } else {
      throw err
    }
  } finally {
    await client.end()
  }

  // Run schema migration if needed
  if (schemaType === 'embeddings' || schemaType === 'memory') {
    // Build connection string for the new db
    const dbUrl = `postgres://${user}:${password}@${host}:5432/${dbName}`
    const pool = new Pool({ connectionString: dbUrl })
    const db = drizzle(pool)
    const schema = getSchema(schemaType)
    // Run migration: create tables from schema
    // This assumes drizzle-orm can sync schema (if not, use a migration tool)
    // @ts-ignore
    await db.execute(schema)
    await pool.end()
    console.log(`Schema for ${schemaType} migrated in ${dbName}.`)
  }
  // For 'insights', do nothing (tables will be created per org as needed)
}

async function getOrCreateDb(dbName: string, schemaType?: DatabaseType) {
  const host = process.env.PG_HOST
  const user = process.env.PG_USER
  const password = process.env.PG_PASSWORD
  const dbUrl = `postgres://${user}:${password}@${host}:5432/${dbName}`

  let pool: Pool
  try {
    pool = new Pool({ connectionString: dbUrl })
    // Try a simple query to check connection
    await pool.query('SELECT 1')
  } catch (err: any) {
    if (err.code === '3D000') {
      // database does not exist
      await createDatabase(dbName, schemaType)
      pool = new Pool({ connectionString: dbUrl })
      await pool.query('SELECT 1') // retry
    } else {
      throw err
    }
  }
  return drizzle(pool)
}

export async function ensureAgencyAndAuthSchemas() {
  const host = process.env.PG_HOST
  const user = process.env.PG_USER
  const password = process.env.PG_PASSWORD
  const dbUrl = `postgres://${user}:${password}@${host}:5432/${process.env.PG_DATABASE}`
  const pool = new Pool({ connectionString: dbUrl })
  const db = drizzle(pool)

  // Ensure schemas exist
  await db.execute(sql`CREATE SCHEMA IF NOT EXISTS agency;`)
  await db.execute(sql`CREATE SCHEMA IF NOT EXISTS auth;`)

  // Sync all tables in both schemas
  // @ts-ignore
  await db.execute(mainSchema)

  await pool.end()
}
