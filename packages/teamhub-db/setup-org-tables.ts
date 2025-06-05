import { ensureOrgTablesExist } from './src/db/functions/utils/database'
import { config } from 'dotenv'

config()

async function setupAllOrgTables() {
  const orgDatabaseNames = process.argv.slice(2)

  if (orgDatabaseNames.length === 0) {
    console.log(
      'Usage: pnpm tsx setup-org-tables.ts <database1> <database2> ...'
    )
    console.log('Example: pnpm tsx setup-org-tables.ts kadiel team_test')
    console.log(
      '\nThis script will create the required tables in the memory and embeddings schemas'
    )
    console.log('for the specified organization databases.')
    process.exit(1)
  }

  console.log('🚀 Starting organization database table setup...')
  console.log(`Setting up tables for databases: ${orgDatabaseNames.join(', ')}`)

  for (const dbName of orgDatabaseNames) {
    try {
      await ensureOrgTablesExist(dbName)
    } catch (error) {
      console.error(`Failed to setup ${dbName}:`, error)
    }
  }

  console.log('🎉 Organization table setup complete!')
  console.log(
    'Your organization databases now have the required memory and embeddings tables.'
  )
}

setupAllOrgTables().catch(console.error)
