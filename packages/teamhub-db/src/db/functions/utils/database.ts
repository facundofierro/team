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

// Function to ensure tables exist in organization databases
export async function ensureOrgTablesExist(orgDbName: string) {
  const host = process.env.PG_HOST
  const user = process.env.PG_USER
  const password = process.env.PG_PASSWORD
  if (!host || !user || !password) {
    throw new Error('Missing PG_HOST, PG_USER, or PG_PASSWORD env vars')
  }
  const orgDbUrl = `postgres://${user}:${password}@${host}:5432/${orgDbName}`
  const pool = new Pool({ connectionString: orgDbUrl })

  try {
    // Create memory table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS memory.memory (
        id text PRIMARY KEY,
        agent_id text,
        agent_clone_id text,
        message_id text,
        type text NOT NULL,
        category text NOT NULL,
        content text,
        structured_data jsonb,
        binary_data text,
        created_at timestamp DEFAULT now(),
        expires_at timestamp
      );
    `)

    // Create indexes for memory table
    await pool.query(`
      CREATE INDEX IF NOT EXISTS memory_agent_type_idx ON memory.memory(agent_id, type);
    `)
    await pool.query(`
      CREATE INDEX IF NOT EXISTS memory_agent_category_idx ON memory.memory(agent_id, category);
    `)

    console.log(`✅ Memory tables created for: ${orgDbName}`)

    // Try to create embeddings table if pgvector is available
    let vectorExtensionAvailable = false
    try {
      await pool.query(`CREATE EXTENSION IF NOT EXISTS vector;`)
      vectorExtensionAvailable = true
      console.log(`✅ pgvector extension available for: ${orgDbName}`)
    } catch (error: any) {
      console.warn(
        `⚠️  pgvector extension not available for ${orgDbName}, skipping embeddings table creation`
      )
    }

    if (vectorExtensionAvailable) {
      try {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS embeddings.embedding (
            id text PRIMARY KEY,
            type text NOT NULL,
            reference_id text NOT NULL,
            vector vector NOT NULL,
            version text NOT NULL,
            model text NOT NULL,
            dimension integer NOT NULL,
            is_deleted boolean DEFAULT false,
            metadata jsonb DEFAULT '{}',
            created_at timestamp DEFAULT now()
          );
        `)

        // Create vector index for embeddings
        await pool.query(`
          CREATE INDEX IF NOT EXISTS vector_idx ON embeddings.embedding USING ivfflat (vector vector_cosine_ops);
        `)

        console.log(`✅ Embeddings tables created for: ${orgDbName}`)
      } catch (error: any) {
        console.warn(
          `⚠️  Could not create embeddings table for ${orgDbName}:`,
          error.message
        )
      }
    }

    console.log(`✅ Tables setup completed for: ${orgDbName}`)
  } catch (error) {
    console.error(`❌ Error ensuring tables for ${orgDbName}:`, error)
    throw error
  } finally {
    await pool.end()
  }
}

// MAIN DB HELPERS (agency/auth)
export async function ensureMainDatabaseAndSchemas() {
  const host = process.env.PG_HOST
  const user = process.env.PG_USER
  const password = process.env.PG_PASSWORD
  const dbName = 'teamhub'
  if (!host || !user || !password || !dbName) {
    throw new Error('Missing PG_HOST, PG_USER, PG_PASSWORD env vars')
  }
  const mainDbUrl = `postgres://${user}:${password}@${host}:5432/${dbName}`
  const adminUrl = `postgres://${user}:${password}@${host}:5432/postgres`

  // Create main DB if not exists
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

  // Ensure schemas exist
  const pool = new Pool({ connectionString: mainDbUrl })
  try {
    await pool.query('CREATE SCHEMA IF NOT EXISTS agency;')
    await pool.query('CREATE SCHEMA IF NOT EXISTS auth;')
  } finally {
    await pool.end()
  }
}

export function getMainDb() {
  const host = process.env.PG_HOST
  const user = process.env.PG_USER
  const password = process.env.PG_PASSWORD
  const dbName = process.env.PG_DATABASE
  if (!host || !user || !password || !dbName) {
    throw new Error(
      'Missing PG_HOST, PG_USER, PG_PASSWORD, or PG_DATABASE env vars'
    )
  }
  const mainDbUrl = `postgres://${user}:${password}@${host}:5432/${dbName}`
  const pool = new Pool({ connectionString: mainDbUrl })
  return drizzle(pool, { schema: mainSchema })
}

// ORG DB HELPERS (per-organization)
export async function createOrgDatabaseAndSchemas(orgDbName: string) {
  const host = process.env.PG_HOST
  const user = process.env.PG_USER
  const password = process.env.PG_PASSWORD
  if (!host || !user || !password) {
    throw new Error('Missing PG_HOST, PG_USER, or PG_PASSWORD env vars')
  }
  const orgDbUrl = `postgres://${user}:${password}@${host}:5432/${orgDbName}`
  const adminUrl = `postgres://${user}:${password}@${host}:5432/postgres`

  // Create org DB if not exists
  const client = new Client({ connectionString: adminUrl })
  try {
    await client.connect()
    await client.query(`CREATE DATABASE "${orgDbName}"`)
    console.log(`Database ${orgDbName} created successfully.`)
  } catch (err: any) {
    if (err.code === '42P04') {
      // 42P04 is 'duplicate_database'
      console.log(`Database ${orgDbName} already exists.`)
    } else {
      throw err
    }
  } finally {
    await client.end()
  }

  // Ensure org schemas exist
  const pool = new Pool({ connectionString: orgDbUrl })
  try {
    await pool.query('CREATE SCHEMA IF NOT EXISTS insights;')
    await pool.query('CREATE SCHEMA IF NOT EXISTS memory;')
    await pool.query('CREATE SCHEMA IF NOT EXISTS embeddings;')
  } finally {
    await pool.end()
  }

  // Ensure tables exist
  await ensureOrgTablesExist(orgDbName)
}

export function getOrgDb(orgDbName: string) {
  const host = process.env.PG_HOST
  const user = process.env.PG_USER
  const password = process.env.PG_PASSWORD
  if (!host || !user || !password) {
    throw new Error('Missing PG_HOST, PG_USER, or PG_PASSWORD env vars')
  }
  const orgDbUrl = `postgres://${user}:${password}@${host}:5432/${orgDbName}`
  const pool = new Pool({ connectionString: orgDbUrl })
  // You can pass the appropriate schema here if needed
  return drizzle(pool)
}
