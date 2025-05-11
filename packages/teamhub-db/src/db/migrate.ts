import { resolve } from 'path'
// config({ path: resolve(__dirname, '../.env') })

import { sql } from 'drizzle-orm'
import { migrate } from 'drizzle-orm/neon-http/migrator'
import * as mainSchema from './schema'
import * as embeddingsSchema from './connections/embeddings/schema'
import * as memorySchema from './connections/memory/schema'

import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { config } from 'dotenv'

// config({ path: './.env' }) // or .env.local

async function main() {
  try {
    // Migrate main database
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set')
    }
    const neonSql = neon<boolean, boolean>(process.env.DATABASE_URL)
    const mainDb = drizzle(neonSql)
    console.log('Migrating main database...')
    // await mainDb.execute(sql`
    //   CREATE SCHEMA IF NOT EXISTS agency;
    // `)
    // await mainDb.execute(sql`
    //   CREATE SCHEMA IF NOT EXISTS auth;
    // `)
    await migrate(mainDb, { migrationsFolder: './drizzle' })

    // Get organizations
    const agencyDb = drizzle(neonSql, { schema: mainSchema })
    const organizations = await agencyDb.query.organization.findMany({
      columns: {
        id: true,
        databaseName: true,
      },
    })

    // Migrate each organization's databases
    // for (const org of organizations) {
    //   const embUrl = process.env[`TEAM${org.databaseName}_EMB_URL`]
    //   const memUrl = process.env[`TEAM${org.databaseName}_MEM_URL`]

    //   if (embUrl) {
    //     console.log(`Migrating embeddings database for ${org.databaseName}...`)
    //     const embDb = drizzleNeon(neon(embUrl))
    //     await migrateNeon(embDb, { migrationsFolder: 'drizzle/embeddings' })
    //   }

    //   if (memUrl) {
    //     console.log(`Migrating memory database for ${org.databaseName}...`)
    //     const memDb = drizzleNeon(neon(memUrl))
    //     await migrateNeon(memDb, { migrationsFolder: 'drizzle/memory' })
    //   }
    // }

    console.log('All migrations completed!')
  } catch (error) {
    console.error('Error performing migrations:', error)
    process.exit(1)
  }
}

main()
