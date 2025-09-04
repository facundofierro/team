import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@agelum/db'
import { auth } from '@/auth'
import { reactiveDb } from '@agelum/db'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: async () => {
      const session = await auth()

      console.log(
        `🔧 tRPC: Creating context for user ${session?.user?.id || 'anonymous'}`
      )

      return {
        session,
        db: reactiveDb, // Pass the reactive database instance
        // Add any other context needed
      }
    },
    onError: ({ error, path }) => {
      console.error(`❌ tRPC Error on path '${path}':`, error)
    },
  })

export { handler as GET, handler as POST }
