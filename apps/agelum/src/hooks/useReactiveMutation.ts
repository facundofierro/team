/**
 * Custom mutation hook for drizzle-reactive with tRPC integration
 * Provides a way to execute mutations and automatically invalidate related cache
 */

import { useCallback, useState } from 'react'
import { trpcClient } from '@/lib/trpc'

interface MutationResult<TData = unknown, TVariables = unknown> {
  mutate: (variables: TVariables) => void
  mutateAsync: (variables: TVariables) => Promise<TData>
  data: TData | undefined
  error: Error | null
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  reset: () => void
}

export function useReactiveMutation<TData = unknown, TVariables = unknown>(
  mutationKey: string
): MutationResult<TData, TVariables> {
  const [data, setData] = useState<TData | undefined>(undefined)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const isSuccess = !isLoading && !error && data !== undefined
  const isError = !isLoading && error !== null

  const reset = useCallback(() => {
    setData(undefined)
    setError(null)
  }, [])

  const mutateAsync = useCallback(
    async (variables: TVariables): Promise<TData> => {
      setIsLoading(true)
      setError(null)

      try {
        console.log(`[useReactiveMutation] Executing ${mutationKey}`, variables)

        // Navigate the tRPC client to find the correct procedure
        const parts = mutationKey.split('.')
        let cursor: any = trpcClient
        for (const part of parts) {
          cursor = cursor?.[part]
        }

        if (!cursor?.mutate) {
          throw new Error(`Mutation procedure not found: ${mutationKey}`)
        }

        // Execute the mutation
        const result = await cursor.mutate(variables)
        
        setData(result)
        console.log(`✅ [useReactiveMutation] ${mutationKey} completed successfully`)
        
        return result
      } catch (err) {
        const error = err as Error
        setError(error)
        console.error(`❌ [useReactiveMutation] ${mutationKey} failed:`, error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [mutationKey]
  )

  const mutate = useCallback(
    (variables: TVariables) => {
      mutateAsync(variables).catch(() => {
        // Error is already handled in mutateAsync
      })
    },
    [mutateAsync]
  )

  return {
    mutate,
    mutateAsync,
    data,
    error,
    isLoading,
    isSuccess,
    isError,
    reset,
  }
}
