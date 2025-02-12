import { sql } from '@vercel/postgres'
import { drizzle } from 'drizzle-orm/vercel-postgres'
import * as schema from './schema'

const db = drizzle(sql, { schema })

// Export the raw db instance for auth adapter
export { db }

import * as agencyFunctions from './functions/agency'
import * as insightsFunctions from './functions/insights'
import * as embeddingsFunctions from './functions/embeddings'

import * as t from './types'

// Export the enhanced db with functions as default
export default {
  t,
  ...agencyFunctions,
  ...insightsFunctions,
  ...embeddingsFunctions,
}
