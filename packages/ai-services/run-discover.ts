import 'dotenv/config'
import { discover } from './src/discover'
import { connection } from './src/db'

const run = async () => {
  const gateway = process.argv[2]
  if (!gateway) {
    console.error(
      'Please provide a gateway name as an argument (e.g., openai, fal, eden, deepseek).'
    )
    process.exit(1)
  }

  console.log(`Starting model discovery for ${gateway}...`)
  try {
    await discover(gateway)
    console.log(`Model discovery for ${gateway} finished successfully.`)
  } catch (error) {
    console.error(
      `An error occurred during model discovery for ${gateway}:`,
      error
    )
    process.exit(1)
  } finally {
    console.log('Closing database connection.')
    await connection.end()
  }
}

run()
