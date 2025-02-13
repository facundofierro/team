import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { sql } from 'drizzle-orm'
import * as memorySchema from '../../connections/memory/schema'
import * as embeddingsSchema from '../../connections/embeddings/schema'

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

export async function createVercelDatabase(name: string, migration?: string) {
  try {
    // Create database using Vercel API
    const response = await fetch('https://api.vercel.com/v9/stores', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        storeId: `postgres-${name}`,
        configuration: {
          type: 'postgres',
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to create database: ${await response.text()}`)
    }

    const { databaseUrl } = await response.json()

    // Run migrations if provided
    // if (migration?.migrationsFolder && databaseUrl) {
    //   await runMigrations(databaseUrl, migration.migrationsFolder)
    //   console.log(`Migrations completed for database: ${name}`)
    // }

    if (migration && databaseUrl) {
      const schema = getSchema(migration)
      const db = drizzle(neon(databaseUrl))
      await db.execute(sql`
        ${schema}
      `)
    }

    return { name, databaseUrl }
  } catch (error) {
    console.error(`Error creating database ${name}:`, error)
    throw error
  }
}
