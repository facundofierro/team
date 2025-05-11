import { Vercel } from '@vercel/sdk'
import { createApiClient } from '@neondatabase/api-client'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { sql } from 'drizzle-orm'
import * as memorySchema from '../../connections/memory/schema'
import * as embeddingsSchema from '../../connections/embeddings/schema'

const neonClient = createApiClient({
  apiKey: process.env.NEON_API_KEY!,
})

type NeonRegion = 'fra1' | 'ord1' | 'syd1' | 'hkg1' | 'scl1' | 'dfw1'

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_API_TOKEN,
})

const PROJECT_ID =
  process.env.VERCEL_PROJECT_ID || 'prj_O0Vb4Pdc2ZrYkp40j7k0kD2MITbD'

const getSchema = (type: string) => {
  switch (type) {
    case 'memory':
      return memorySchema.memory
    case 'embeddings':
      return embeddingsSchema.embedding
    default:
      throw new Error(`Unknown schema type: ${type}`)
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function addEnvVars(envVars: Record<string, string>) {
  if (!PROJECT_ID) throw new Error('VERCEL_PROJECT_ID is not set')

  await vercel.env.createMany(
    PROJECT_ID,
    Object.entries(envVars).map(([key, value]) => ({
      key,
      value,
      type: 'encrypted',
      target: ['production', 'preview', 'development'],
    }))
  )
}

async function waitForDatabase(
  storeId: string,
  maxAttempts = 10
): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(
      `https://api.vercel.com/v9/stores/${storeId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
        },
      }
    )
    const data = await response.json()

    if (data.status === 'ready') {
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  throw new Error('Database creation timeout')
}

export async function createVercelDatabase(name: string, migration?: string) {
  try {
    // Create database using Neon API
    const { database } = await neonClient.createDatabase({
      projectId: process.env.NEON_PROJECT_ID!,
      name: name,
    })

    // Get connection string
    const { connection_uri } = await neonClient.getDatabaseConnectionUri({
      projectId: process.env.NEON_PROJECT_ID!,
      databaseName: database.name,
    })

    if (migration && connection_uri) {
      const schema = getSchema(migration)
      const db = drizzle(neon(connection_uri))
      await db.execute(sql`${schema}`)
    }

    // Add env var using Vercel SDK
    await vercel.env.add({
      key: `TEAM_${name.toUpperCase()}_URL`,
      value: connection_uri,
      type: 'encrypted',
      target: ['production', 'preview', 'development'],
    })

    return {
      name,
      connectionString: connection_uri,
    }
  } catch (error) {
    console.error(`Error creating database ${name}:`, error)
    throw error
  }
}
