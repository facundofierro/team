/**
 * React hooks for reactive database queries
 */

import { useEffect, useState, useRef, useCallback } from 'react'
import { ReactiveClientManager } from './manager'
import type { ReactiveConfig } from '../core/types'
import type { RevalidationOptions } from './revalidation'

export interface UseReactiveResult<T> {
  data: T | undefined
  isLoading: boolean
  isStale: boolean
  error: Error | null
  refetch: () => Promise<void>
}

// Global client manager instance
let globalClientManager: ReactiveClientManager | null = null

/**
 * Initialize the reactive client manager
 */
export function initializeReactiveClient(
  organizationId: string,
  config: ReactiveConfig,
  revalidateFn: (queryKey: string) => Promise<any>
): void {
  if (globalClientManager) {
    globalClientManager.cleanup()
  }

  globalClientManager = new ReactiveClientManager({
    organizationId,
    config,
    onRevalidate: revalidateFn,
  })
}

/**
 * Get the global client manager
 */
function getClientManager(): ReactiveClientManager {
  if (!globalClientManager) {
    throw new Error(
      '@drizzle/reactive: Client not initialized. Call initializeReactiveClient first.'
    )
  }
  return globalClientManager
}

/**
 * Zero-configuration reactive hook
 */
export function useReactive<T>(
  operation: string,
  input?: any,
  dependencies: string[] = []
): UseReactiveResult<T> {
  const [data, setData] = useState<T | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [isStale, setIsStale] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const clientManager = getClientManager()
  const queryKey = `${operation}:${JSON.stringify(input || {})}`
  const cleanupRef = useRef<(() => void) | null>(null)

  // Register this hook as active for priority revalidation
  useEffect(() => {
    cleanupRef.current = clientManager.registerActiveHook(
      queryKey,
      dependencies
    )

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
      }
    }
  }, [queryKey, dependencies.join(','), clientManager])

  // Load initial data from cache or trigger fetch
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Check cache first
        const cached = clientManager.getCachedData(queryKey)
        if (cached) {
          setData(cached.data)
          setIsStale(cached.isStale)
          setIsLoading(false)

          // If cached data is stale, we still show it but mark as stale
          if (!cached.isStale) {
            return // Fresh cached data, we're done
          }
        }

        // If no cache or stale data, we need to fetch
        // Queue for smart revalidation with appropriate priority
        if (cached?.isStale) {
          console.log(
            `[useReactive] Stale cache for ${queryKey}, queuing revalidation`
          )
          clientManager.queueRevalidation(queryKey, 10) // High priority for active hooks
        } else {
          console.log(
            `[useReactive] Cache miss for ${queryKey}, queuing immediate revalidation`
          )
          clientManager.queueRevalidation(queryKey, 20) // Highest priority for cache misses
        }

        setIsLoading(false)
      } catch (err) {
        setError(err as Error)
        setIsLoading(false)
      }
    }

    loadData()
  }, [queryKey, clientManager])

  const refetch = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Force refetch logic would go here
      console.log(`[useReactive] Manual refetch for ${queryKey}`)

      // Simulate successful refetch
      setIsStale(false)
      setIsLoading(false)
    } catch (err) {
      setError(err as Error)
      setIsLoading(false)
    }
  }, [queryKey])

  return {
    data,
    isLoading,
    isStale,
    error,
    refetch,
  }
}

/**
 * Optional page-level priority hints for better UX
 */
export function useReactivePriorities(priorities: string[]): void {
  useEffect(() => {
    console.log('[useReactivePriorities] Setting priority hints:', priorities)

    // In a full implementation, this would:
    // 1. Pre-warm cache for these queries
    // 2. Subscribe to their invalidation events
    // 3. Set higher revalidation priority

    return () => {
      console.log('[useReactivePriorities] Cleaning up priority hints')
    }
  }, [priorities.join(',')])
}

/**
 * Hook to get current session statistics
 */
export function useReactiveStats() {
  const [stats, setStats] = useState<any>(null)
  const clientManager = getClientManager()

  useEffect(() => {
    const updateStats = () => {
      setStats(clientManager.getSessionStats())
    }

    // Update stats immediately
    updateStats()

    // Update stats every 5 seconds
    const interval = setInterval(updateStats, 5000)

    return () => clearInterval(interval)
  }, [clientManager])

  return stats
}

/**
 * Hook to manually trigger cache refresh
 */
export function useReactiveRefresh() {
  const clientManager = getClientManager()

  return useCallback(async () => {
    await clientManager.forceRefresh()
  }, [clientManager])
}

/**
 * Hook for smart revalidation with priority options
 */
export function useSmartRevalidation() {
  const clientManager = getClientManager()

  const smartRevalidate = useCallback(
    async (queries: string[], options?: RevalidationOptions) => {
      return await clientManager.smartRevalidate(queries, options)
    },
    [clientManager]
  )

  const queueRevalidation = useCallback(
    (queryKey: string, priority: number = 0) => {
      clientManager.queueRevalidation(queryKey, priority)
    },
    [clientManager]
  )

  const processQueue = useCallback(
    async (options?: RevalidationOptions) => {
      await clientManager.processRevalidationQueue(options)
    },
    [clientManager]
  )

  return {
    smartRevalidate,
    queueRevalidation,
    processQueue,
  }
}

/**
 * Hook to get revalidation statistics and performance metrics
 */
export function useRevalidationStats() {
  const [stats, setStats] = useState<any>(null)
  const clientManager = getClientManager()

  useEffect(() => {
    const updateStats = () => {
      const sessionStats = clientManager.getSessionStats()
      setStats(sessionStats.revalidation)
    }

    updateStats()
    const interval = setInterval(updateStats, 2000)

    return () => clearInterval(interval)
  }, [clientManager])

  return stats
}

/**
 * Hook to handle invalidation events
 */
export function useReactiveInvalidation(callback: (event: any) => void): void {
  const clientManager = getClientManager()

  useEffect(() => {
    // In a full implementation, this would subscribe to invalidation events
    console.log('[useReactiveInvalidation] Setting up invalidation listener')

    return () => {
      console.log('[useReactiveInvalidation] Cleaning up invalidation listener')
    }
  }, [callback, clientManager])
}
