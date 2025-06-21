import 'dotenv/config'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { db, connection } from './index'

async function main() {
  console.log('Running migrations...')
  await migrate(db, { migrationsFolder: './drizzle' })
  console.log('Migrations finished.')
  await connection.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
