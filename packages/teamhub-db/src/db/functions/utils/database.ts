import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool, Client } from 'pg'
import * as memorySchema from '../../connections/memory/schema'
import * as embeddingsSchema from '../../connections/embeddings/schema'
import * as mainSchema from '../../schema'
import { sql } from 'drizzle-orm'

// Debug logger for optional verbose setup logs
const DB_SETUP_DEBUG =
  process.env.DEBUG_DB_SETUP === 'true' || process.env.DEBUG_DB_SETUP === '1'
const debugLog = (...args: Parameters<typeof console.log>) => {
  if (DB_SETUP_DEBUG) {
    console.log(...args)
  }
}

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

// Function to automatically install pgvector extension when missing
async function installPgvectorExtension(
  pool: Pool,
  orgDbName: string
): Promise<boolean> {
  debugLog(`🔧 Attempting to install pgvector extension for ${orgDbName}...`)

  try {
    // Try to create the extension
    await pool.query(`CREATE EXTENSION IF NOT EXISTS vector;`)

    // Verify the extension was created successfully
    const result = await pool.query(`
      SELECT extversion
      FROM pg_extension
      WHERE extname = 'vector';
    `)

    if (result.rows.length > 0) {
      debugLog(
        `✅ pgvector extension successfully installed for ${orgDbName} (version: ${result.rows[0].extversion})`
      )
      return true
    } else {
      console.warn(
        `⚠️  pgvector extension creation appeared to succeed but extension not found in ${orgDbName}`
      )
      return false
    }
  } catch (error: any) {
    // Check if it's a permission issue or missing binary
    if (error.message.includes('permission denied')) {
      console.error(
        `❌ Permission denied installing pgvector extension in ${orgDbName}. Database user may need SUPERUSER privileges.`
      )
    } else if (
      error.message.includes('could not open extension control file')
    ) {
      console.error(
        `❌ pgvector extension files not found in ${orgDbName}. The PostgreSQL image may not have pgvector installed.`
      )
    } else {
      console.error(
        `❌ Failed to install pgvector extension in ${orgDbName}:`,
        error.message
      )
    }
    return false
  }
}

// Enhanced function to check if pgvector extension is available
async function checkPgvectorAvailability(
  pool: Pool,
  orgDbName: string
): Promise<boolean> {
  try {
    // First, check if the extension is already installed
    const existingResult = await pool.query(`
      SELECT extversion
      FROM pg_extension
      WHERE extname = 'vector';
    `)

    if (existingResult.rows.length > 0) {
      debugLog(
        `✅ pgvector extension already available for ${orgDbName} (version: ${existingResult.rows[0].extversion})`
      )
      return true
    }

    // If not installed, try to install it
    debugLog(
      `🔍 pgvector extension not found for ${orgDbName}, attempting installation...`
    )
    return await installPgvectorExtension(pool, orgDbName)
  } catch (error: any) {
    console.warn(
      `⚠️  Could not check pgvector availability for ${orgDbName}:`,
      error.message
    )
    return false
  }
}

// Fix existing vector tables with dimension issues
async function fixVectorDimensionIssues(
  pool: Pool,
  orgDbName: string
): Promise<void> {
  try {
    debugLog(`🔧 Checking and fixing vector dimension issues for ${orgDbName}`)

    // Check if memory table exists and has vector column without dimensions
    const tableCheck = await pool.query(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns
      WHERE table_schema = 'memory'
      AND table_name = 'memory'
      AND column_name = 'embedding'
    `)

    if (tableCheck.rows.length > 0) {
      const columnInfo = tableCheck.rows[0]
      debugLog(`📊 Found embedding column:`, columnInfo)

      // Check if it's a vector type without dimensions
      if (columnInfo.udt_name === 'vector') {
        try {
          // Try to create a vector index to test if dimensions are properly set
          await pool.query(`
            CREATE INDEX IF NOT EXISTS test_memory_embedding_idx
            ON memory.memory USING ivfflat (embedding vector_cosine_ops)
          `)
          debugLog(`✅ Vector column has proper dimensions in ${orgDbName}`)
        } catch (error: any) {
          if (error.message.includes('does not have dimensions')) {
            debugLog(`🔄 Fixing vector dimension issue in ${orgDbName}`)

            // Drop the problematic column and recreate it with proper dimensions
            await pool.query(
              `ALTER TABLE memory.memory DROP COLUMN IF EXISTS embedding`
            )
            await pool.query(
              `ALTER TABLE memory.memory ADD COLUMN embedding vector(1536)`
            )

            debugLog(`✅ Fixed vector column dimensions in ${orgDbName}`)
          } else {
            console.warn(
              `⚠️ Other vector index error in ${orgDbName}:`,
              error.message
            )
          }
        }
      }
    }

    // Do the same for embeddings table
    const embTableCheck = await pool.query(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns
      WHERE table_schema = 'embeddings'
      AND table_name = 'embedding'
      AND column_name = 'vector'
    `)

    if (embTableCheck.rows.length > 0) {
      const columnInfo = embTableCheck.rows[0]

      if (columnInfo.udt_name === 'vector') {
        try {
          await pool.query(`
            CREATE INDEX IF NOT EXISTS test_vector_idx
            ON embeddings.embedding USING ivfflat (vector vector_cosine_ops)
          `)
          debugLog(
            `✅ Embeddings vector column has proper dimensions in ${orgDbName}`
          )
        } catch (error: any) {
          if (error.message.includes('does not have dimensions')) {
            debugLog(
              `🔄 Fixing embeddings vector dimension issue in ${orgDbName}`
            )

            await pool.query(
              `ALTER TABLE embeddings.embedding DROP COLUMN IF EXISTS vector`
            )
            await pool.query(
              `ALTER TABLE embeddings.embedding ADD COLUMN vector vector(1536) NOT NULL`
            )

            debugLog(
              `✅ Fixed embeddings vector column dimensions in ${orgDbName}`
            )
          }
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error fixing vector dimensions for ${orgDbName}:`, error)
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
    // Create memory tables if they don't exist
    await migrateMemoryTables(pool, orgDbName)

    debugLog(`✅ Memory tables created for: ${orgDbName}`)

    // Enhanced pgvector availability check with automatic installation
    const vectorExtensionAvailable = await checkPgvectorAvailability(
      pool,
      orgDbName
    )

    // Fix any existing vector dimension issues
    if (vectorExtensionAvailable) {
      await fixVectorDimensionIssues(pool, orgDbName)
    }

    if (vectorExtensionAvailable) {
      try {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS embeddings.embedding (
            id text PRIMARY KEY,
            type text NOT NULL,
            reference_id text NOT NULL,
            vector vector(1536) NOT NULL, -- Specify dimensions (1536 for OpenAI embeddings)
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

        debugLog(`✅ Embeddings tables created for: ${orgDbName}`)
      } catch (error: any) {
        console.warn(
          `⚠️  Could not create embeddings table for ${orgDbName}:`,
          error.message
        )
      }
    } else {
      console.warn(
        `⚠️  pgvector extension not available for ${orgDbName}, skipping embeddings table creation`
      )
    }

    debugLog(`✅ Tables setup completed for: ${orgDbName}`)
  } catch (error) {
    console.error(`❌ Error ensuring tables for ${orgDbName}:`, error)
    throw error
  } finally {
    await pool.end()
  }
}

// Create memory tables function
async function migrateMemoryTables(pool: Pool, orgDbName: string) {
  try {
    // Create schemas first
    await pool.query(`CREATE SCHEMA IF NOT EXISTS memory;`)
    await pool.query(`CREATE SCHEMA IF NOT EXISTS embeddings;`)

    // Enhanced pgvector availability check with automatic installation
    const vectorExtensionAvailable = await checkPgvectorAvailability(
      pool,
      orgDbName
    )

    // Create the new unified memory table with conditional vector column
    const createTableQuery = vectorExtensionAvailable
      ? `
      CREATE TABLE IF NOT EXISTS memory.memory (
        id text PRIMARY KEY,
        agent_id text NOT NULL,
        agent_clone_id text,

        -- Memory type and categorization
        type text NOT NULL, -- 'conversation', 'fact', 'preference', 'skill', 'context', 'task'
        category text NOT NULL, -- More specific categorization

        -- Content storage - flexible for different memory types
        title text NOT NULL, -- Conversation title or fact description
        content jsonb NOT NULL, -- Full conversation array OR single fact object
        summary text, -- Brief description or the fact itself
        description text, -- What info can be found here

        -- Semantic and structural data
        key_topics jsonb, -- Array of topics/entities
        tags jsonb, -- User or auto-generated tags
        embedding vector(1536), -- For semantic search (requires pgvector, 1536 dimensions for OpenAI)

        -- Memory metadata and importance
        importance integer DEFAULT 1, -- 1-10 scale
        message_count integer DEFAULT 1, -- 1 for facts, N for conversations
        participant_ids jsonb, -- Array of user/agent IDs involved

        -- Conversation lifecycle flags
        is_active boolean DEFAULT false, -- True for currently active conversation
        needs_brief boolean DEFAULT true, -- True when conversation needs summary generation

        -- Usage and lifecycle tracking
        access_count integer DEFAULT 0,
        last_accessed_at timestamp,
        status text DEFAULT 'active', -- 'active', 'archived', 'deleted'

        -- Timestamps
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now(),
        expires_at timestamp
      );
    `
      : `
      CREATE TABLE IF NOT EXISTS memory.memory (
        id text PRIMARY KEY,
        agent_id text NOT NULL,
        agent_clone_id text,

        -- Memory type and categorization
        type text NOT NULL, -- 'conversation', 'fact', 'preference', 'skill', 'context', 'task'
        category text NOT NULL, -- More specific categorization

        -- Content storage - flexible for different memory types
        title text NOT NULL, -- Conversation title or fact description
        content jsonb NOT NULL, -- Full conversation array OR single fact object
        summary text, -- Brief description or the fact itself
        description text, -- What info can be found here

        -- Semantic and structural data
        key_topics jsonb, -- Array of topics/entities
        tags jsonb, -- User or auto-generated tags

        -- Memory metadata and importance
        importance integer DEFAULT 1, -- 1-10 scale
        message_count integer DEFAULT 1, -- 1 for facts, N for conversations
        participant_ids jsonb, -- Array of user/agent IDs involved

        -- Conversation lifecycle flags
        is_active boolean DEFAULT false, -- True for currently active conversation
        needs_brief boolean DEFAULT true, -- True when conversation needs summary generation

        -- Usage and lifecycle tracking
        access_count integer DEFAULT 0,
        last_accessed_at timestamp,
        status text DEFAULT 'active', -- 'active', 'archived', 'deleted'

        -- Timestamps
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now(),
        expires_at timestamp
      );
    `

    await pool.query(createTableQuery)

    // Create indexes for the new memory table
    await pool.query(`
      CREATE INDEX IF NOT EXISTS memory_agent_type_idx ON memory.memory(agent_id, type);
    `)
    await pool.query(`
      CREATE INDEX IF NOT EXISTS memory_agent_category_idx ON memory.memory(agent_id, category);
    `)
    await pool.query(`
      CREATE INDEX IF NOT EXISTS memory_agent_status_idx ON memory.memory(agent_id, status);
    `)
    await pool.query(`
      CREATE INDEX IF NOT EXISTS memory_agent_clone_idx ON memory.memory(agent_id, agent_clone_id);
    `)
    await pool.query(`
      CREATE INDEX IF NOT EXISTS memory_importance_idx ON memory.memory(importance);
    `)
    await pool.query(`
      CREATE INDEX IF NOT EXISTS memory_last_access_idx ON memory.memory(last_accessed_at);
    `)
    await pool.query(`
      CREATE INDEX IF NOT EXISTS memory_created_at_idx ON memory.memory(created_at);
    `)
    await pool.query(`
      CREATE INDEX IF NOT EXISTS memory_agent_active_idx ON memory.memory(agent_id, is_active);
    `)
    await pool.query(`
      CREATE INDEX IF NOT EXISTS memory_agent_needs_brief_idx ON memory.memory(agent_id, needs_brief);
    `)

    // Create vector index if possible
    if (vectorExtensionAvailable) {
      try {
        await pool.query(`
          CREATE INDEX IF NOT EXISTS memory_embedding_idx ON memory.memory USING ivfflat (embedding vector_cosine_ops);
        `)
        debugLog(`✅ Vector index created for memory table in ${orgDbName}`)
      } catch (error) {
        console.warn(
          `⚠️  Vector index not created for memory table in ${orgDbName}:`,
          error
        )
      }
    } else {
      console.warn(
        `⚠️  pgvector extension not available for ${orgDbName}, creating table without vector column`
      )
    }
  } catch (error) {
    console.error(`❌ Error migrating memory tables for ${orgDbName}:`, error)
    throw error
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

  // Create org DB if not exists, using pgvector template if available
  const client = new Client({ connectionString: adminUrl })
  try {
    await client.connect()

    // Check if template_pgvector exists
    const templateResult = await client.query(`
      SELECT 1 FROM pg_database WHERE datname = 'template_pgvector'
    `)

    const createDbQuery =
      templateResult.rows.length > 0
        ? `CREATE DATABASE "${orgDbName}" WITH TEMPLATE template_pgvector`
        : `CREATE DATABASE "${orgDbName}"`

    try {
      await client.query(createDbQuery)
    } catch (e: any) {
      // Some Postgres setups emit 23505 (unique violation) instead of 42P04 here
      if (e?.code === '42P04' || e?.code === '23505') {
        console.log(`Database ${orgDbName} already exists (code ${e.code}).`)
      } else {
        throw e
      }
    }

    if (templateResult.rows.length > 0) {
      console.log(
        `Database ${orgDbName} created successfully with pgvector template.`
      )
    } else {
      console.log(
        `Database ${orgDbName} created successfully (no pgvector template available).`
      )
    }
  } catch (err: any) {
    if (err.code === '42P04' || err.code === '23505') {
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
