import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(__dirname, '../.env') })

import { sql } from '@vercel/postgres'
import { drizzle } from 'drizzle-orm/vercel-postgres'
import { migrate as migrateVercel } from 'drizzle-orm/vercel-postgres/migrator'
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http'
import { migrate as migrateNeon } from 'drizzle-orm/neon-http/migrator'
import { neon } from '@neondatabase/serverless'
import * as mainSchema from './schema'
import * as embeddingsSchema from './connections/embeddings/schema'
import * as memorySchema from './connections/memory/schema'

async function main() {
  try {
    // Migrate main database
    const mainDb = drizzle(sql)
    console.log('Migrating main database...')
    await migrateVercel(mainDb, { migrationsFolder: 'drizzle/main' })

    // Get organizations
    const agencyDb = drizzle(sql, { schema: mainSchema })
    const organizations = await agencyDb.query.organization.findMany({
      columns: {
        id: true,
        databaseName: true,
      },
    })

    // Migrate each organization's databases
    for (const org of organizations) {
      const embUrl = process.env[`TEAM${org.databaseName}_EMB_URL`]
      const memUrl = process.env[`TEAM${org.databaseName}_MEM_URL`]

      if (embUrl) {
        console.log(`Migrating embeddings database for ${org.databaseName}...`)
        const embDb = drizzleNeon(neon(embUrl))
        await migrateNeon(embDb, { migrationsFolder: 'drizzle/embeddings' })
      }

      if (memUrl) {
        console.log(`Migrating memory database for ${org.databaseName}...`)
        const memDb = drizzleNeon(neon(memUrl))
        await migrateNeon(memDb, { migrationsFolder: 'drizzle/memory' })
      }
    }

    console.log('All migrations completed!')
  } catch (error) {
    console.error('Error performing migrations:', error)
    process.exit(1)
  }
}

main()
