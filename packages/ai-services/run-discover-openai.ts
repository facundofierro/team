import { discover } from './src/discover/openai'
import { connection } from './src/db'

// Environment variables will be loaded via the -r flag in the pnpm command
// dotenv.config({ path: '.env' })

const run = async () => {
  console.log('Starting OpenAI model discovery...')
  try {
    await discover()
    console.log('OpenAI model discovery finished successfully.')
  } catch (error) {
    console.error('An error occurred during OpenAI model discovery:', error)
    process.exit(1)
  } finally {
    console.log('Closing database connection.')
    await connection.end()
  }
}

run()
