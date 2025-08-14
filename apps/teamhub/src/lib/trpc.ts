import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@teamhub/db'

// Create the tRPC client with proxy client for better type inference
export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
    }),
  ],
})

// Debug: Log the client structure to see what's available
console.log('🔧 [tRPC Client] Client created:', trpcClient)
console.log('🔧 [tRPC Client] Available keys:', Object.keys(trpcClient))
console.log('🔧 [tRPC Client] Client type:', typeof trpcClient)
