const { Pool } = require('pg')
require('dotenv').config()

async function ensureOrgTablesExist(orgDbName) {
  const host = process.env.PG_HOST
  const user = process.env.PG_USER
  const password = process.env.PG_PASSWORD

  if (!host || !user || !password) {
    throw new Error('Missing PG_HOST, PG_USER, or PG_PASSWORD env vars')
  }

  const orgDbUrl = `postgres://${user}:${password}@${host}:5432/${orgDbName}`
  const pool = new Pool({ connectionString: orgDbUrl })

  try {
    console.log(`Setting up tables for database: ${orgDbName}`)

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

    // Create embeddings table if not exists (requires pgvector extension)
    try {
      await pool.query(`CREATE EXTENSION IF NOT EXISTS vector;`)
    } catch (error) {
      console.warn(
        `Could not create vector extension for ${orgDbName}:`,
        error.message
      )
    }

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
    try {
      await pool.query(`
        CREATE INDEX IF NOT EXISTS vector_idx ON embeddings.embedding USING ivfflat (vector vector_cosine_ops);
      `)
    } catch (error) {
      console.warn(
        `Could not create vector index for ${orgDbName}:`,
        error.message
      )
    }

    console.log(`✅ Tables setup completed for: ${orgDbName}`)
  } catch (error) {
    console.error(`❌ Error setting up tables for ${orgDbName}:`, error.message)
    throw error
  } finally {
    await pool.end()
  }
}

async function setupAllOrgTables() {
  const orgDatabaseNames = process.argv.slice(2)

  if (orgDatabaseNames.length === 0) {
    console.log('Usage: node setup-org-tables.js <database1> <database2> ...')
    console.log('Example: node setup-org-tables.js kadiel team_test')
    process.exit(1)
  }

  console.log('🚀 Starting organization database table setup...')

  for (const dbName of orgDatabaseNames) {
    try {
      await ensureOrgTablesExist(dbName)
    } catch (error) {
      console.error(`Failed to setup ${dbName}:`, error.message)
    }
  }

  console.log('🎉 Organization table setup complete!')
}

setupAllOrgTables().catch(console.error)
