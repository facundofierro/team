import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(__dirname, '../.env') })

import { sql } from '@vercel/postgres'
import { drizzle } from 'drizzle-orm/vercel-postgres'
import { migrate } from 'drizzle-orm/vercel-postgres/migrator'

async function main() {
  try {
    if (!process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
      throw new Error('Database connection string not found')
    }

    const db = drizzle(sql)
    console.log('Running migrations...')
    await migrate(db, { migrationsFolder: 'drizzle' })
    console.log('Migrations completed!')
  } catch (error) {
    console.error('Error performing migrations:', error)
    process.exit(1)
  }
}

main()
