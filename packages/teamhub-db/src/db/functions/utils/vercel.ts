import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http'
import { migrate as migrateNeon } from 'drizzle-orm/neon-http/migrator'
import { neon } from '@neondatabase/serverless'

type MigrationConfig = {
  migrationsFolder: string
  schema?: unknown
}

export async function createVercelDatabase(
  name: string,
  migration?: MigrationConfig
) {
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
    if (migration && databaseUrl) {
      const db = drizzleNeon(neon(databaseUrl))
      await migrateNeon(db, { migrationsFolder: migration.migrationsFolder })
      console.log(`Migrations completed for database: ${name}`)
    }

    return { name, databaseUrl }
  } catch (error) {
    console.error(`Error creating database ${name}:`, error)
    throw error
  }
}
