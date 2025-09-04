import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@agelum/db'

// Create the tRPC client with proxy client for better type inference
export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
    }),
  ],
})

// Debug: Log the client structure to see what's available (reduced logging)
console.log('🔧 [tRPC Client] Client created with keys:', Object.keys(trpcClient).length)
