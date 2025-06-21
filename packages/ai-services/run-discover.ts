import 'dotenv/config'
import { discover } from './src/discover'
import { connection } from './src/db'

// Environment variables will be loaded via the -r flag in the pnpm command
// dotenv.config({ path: '.env' })

const run = async () => {
  const provider = process.argv[2]
  if (!provider) {
    console.error(
      'Please provide a provider name as an argument (e.g., openai, fal, eden, deepseek).'
    )
    process.exit(1)
  }

  console.log(`Starting model discovery for ${provider}...`)
  try {
    await discover(provider)
    console.log(`Model discovery for ${provider} finished successfully.`)
  } catch (error) {
    console.error(
      `An error occurred during model discovery for ${provider}:`,
      error
    )
    process.exit(1)
  } finally {
    console.log('Closing database connection.')
    await connection.end()
  }
}

run()
