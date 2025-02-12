import 'dotenv/config'
import type { Config } from 'drizzle-kit'

export default {
  schema: 'src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  driver: 'pg',
  dbCredentials: {
    url: process.env.POSTGRES_URL || '',
    // user: process.env.POSTGRES_USER,
    // password: process.env.POSTGRES_PASSWORD,
    // database: process.env.POSTGRES_DATABASE || 'tol',
  },
} // satisfies Config

// POSTGRES_DATABASE = 'verceldb'
// POSTGRES_HOST = 'ep-spring-glitter-37617071-pooler.us-east-1.postgres.vercel-storage.com'
// POSTGRES_PASSWORD = 'daPtqgp45QIZ'
// POSTGRES_PRISMA_URL = 'postgres://default:daPtqgp45QIZ@ep-spring-glitter-37617071-pooler.us-east-1.postgres.vercel-storage.com/verceldb?pgbouncer=true&connect_timeout=15'
// POSTGRES_URL = 'postgres://default:daPtqgp45QIZ@ep-spring-glitter-37617071-pooler.us-east-1.postgres.vercel-storage.com/verceldb'
// POSTGRES_URL_NON_POOLING = 'postgres://default:daPtqgp45QIZ@ep-spring-glitter-37617071.us-east-1.postgres.vercel-storage.com/verceldb'
// POSTGRES_USER = 'default'
