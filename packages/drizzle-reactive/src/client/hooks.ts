/**
 * React hooks for @drizzle/reactive
 * Provides reactive data access with automatic caching and real-time updates
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { ReactiveClientManager, createReactiveClientManager } from './manager'
import type { ReactiveConfig, InvalidationEvent } from '../core/types'

// Global client manager instance
let globalClientManager: ReactiveClientManager | null = null

/**
 * Get or create the global client manager
 */
function getClientManager(): ReactiveClientManager {
  if (!globalClientManager) {
    throw new Error('Reactive client not initialized. Call initializeReactiveClient first.')
  }
  return globalClientManager
}

/**
 * Initialize the reactive client
 * Call this once at app startup
 */
export function initializeReactiveClient(
  organizationId: string,
  config: ReactiveConfig,
  revalidateFn: (queryKey: string) => Promise<any>
): void {
  console.log('🚀 Initializing reactive client for org:', organizationId)

  if (globalClientManager) {
    console.log('⚠️ Client already initialized, cleaning up previous instance')
    globalClientManager.cleanup()
  }

  globalClientManager = createReactiveClientManager({
    organizationId,
    config,
    onRevalidate: revalidateFn,
    onInvalidation: (event: InvalidationEvent) => {
      console.log(`[ReactiveClient] Received invalidation for table: ${event.table}`)
    },
  })

  console.log('✅ Reactive client initialized successfully for org:', organizationId)
}

/**
 * Main hook for reactive data access
 * Automatically handles caching, real-time updates, and revalidation
 */
export function useReactive<T = any>(
  queryKey: string,
  input?: any
): {
  data: T | undefined
  isLoading: boolean
  isStale: boolean
  error: Error | null
  refetch: () => void
} {
  const [data, setData] = useState<T | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [isStale, setIsStale] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const clientManager = getClientManager()
  const isInitialMount = useRef(true)

  // Register this hook as active
  useEffect(() => {
    const cleanup = clientManager.registerActiveHook(queryKey, [])
    return cleanup
  }, [queryKey, clientManager])

  // Load data on mount and when queryKey changes
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Check cache first
        const cached = clientManager.getCachedData(queryKey)
        
        if (cached && !isInitialMount.current) {
          // Use cached data if available
          setData(cached.data)
          setIsStale(cached.isStale || false)
          setIsLoading(false)
          return
        }

        // If no cache or stale data, we need to fetch
        if (cached?.isStale) {
          console.log(
            `[useReactive] Stale cache for ${queryKey}, triggering revalidation`
          )
          // Trigger revalidation for stale data
          await clientManager.revalidateQuery(queryKey)
        } else {
          console.log(
            `[useReactive] Cache miss for ${queryKey}, triggering immediate fetch`
          )
          // Trigger immediate fetch for cache misses
          await clientManager.revalidateQuery(queryKey)
        }

        setIsLoading(false)
        isInitialMount.current = false
      } catch (err) {
        setError(err as Error)
        setIsLoading(false)
        isInitialMount.current = false
      }
    }

    loadData()
  }, [queryKey, clientManager])

  const refetch = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log(`[useReactive] Manual refetch for ${queryKey}`)
      
      // Trigger manual revalidation
      await clientManager.revalidateQuery(queryKey)
      
      // Update stale state
      setIsStale(false)
      setIsLoading(false)
    } catch (err) {
      setError(err as Error)
      setIsLoading(false)
    }
  }, [queryKey, clientManager])

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
    // Trigger revalidation for all active queries
    const activeHooks = clientManager.getStorageStats()?.queries || {}
    const activeQueryKeys = Object.keys(activeHooks)
    
    console.log(`[useReactiveRefresh] Refreshing ${activeQueryKeys.length} active queries`)
    
    // Revalidate all active queries
    await Promise.allSettled(
      activeQueryKeys.map(queryKey => clientManager.revalidateQuery(queryKey))
    )
  }, [clientManager])
}

/**
 * Hook to get revalidation statistics and performance metrics
 */
export function useRevalidationStats() {
  const [stats, setStats] = useState<any>(null)
  const clientManager = getClientManager()

  useEffect(() => {
    const updateStats = () => {
      const revalidationStats = clientManager.getRevalidationStats()
      setStats(revalidationStats)
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
export function useReactiveInvalidation(callback: (event: InvalidationEvent) => void): void {
  const clientManager = getClientManager()

  useEffect(() => {
    // In a full implementation, this would subscribe to invalidation events
    console.log('[useReactiveInvalidation] Setting up invalidation listener')

    return () => {
      console.log('[useReactiveInvalidation] Cleaning up invalidation listener')
    }
  }, [callback, clientManager])
}

/**
 * Hook to get connection status
 */
export function useReactiveConnection() {
  const [status, setStatus] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected')
  const clientManager = getClientManager()

  useEffect(() => {
    const updateStatus = () => {
      setStatus(clientManager.getConnectionStatus())
    }

    updateStatus()
    const interval = setInterval(updateStatus, 1000)

    return () => clearInterval(interval)
  }, [clientManager])

  return {
    status,
    isConnected: status === 'connected',
    isConnecting: status === 'connecting',
    isDisconnected: status === 'disconnected',
    reconnect: () => clientManager.reconnectSSE(),
  }
}
