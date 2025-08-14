/**
 * Client-side storage management for reactive queries
 * Handles localStorage-based query registry and session persistence
 */

import type { QueryRegistry, HookState } from '../core/types'

export class ReactiveStorage {
  private storageKey = '@drizzle/reactive:registry'
  private activeHooks = new Map<string, HookState>()
  private sessionId: string
  private organizationId: string

  constructor(organizationId: string) {
    this.organizationId = organizationId
    this.sessionId = this.generateSessionId()
    this.initializeRegistry()
    this.cleanupExpiredEntries()
  }

  /**
   * Initialize the query registry for this organization
   */
  private initializeRegistry(): void {
    const existing = this.getRegistry()
    if (!existing || existing.organizationId !== this.organizationId) {
      // Create new registry for this organization
      const newRegistry: QueryRegistry = {
        organizationId: this.organizationId,
        queries: {},
        session: {
          startTime: Date.now(),
          lastSync: Date.now(),
          realtimeConnected: false,
        },
      }
      this.saveRegistry(newRegistry)
    } else {
      // Update session info
      existing.session.startTime = Date.now()
      existing.session.lastSync = Date.now()
      this.saveRegistry(existing)
    }
  }

  /**
   * Get the current query registry
   */
  getRegistry(): QueryRegistry | null {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (!stored) return null

      const registry = JSON.parse(stored) as QueryRegistry
      return registry
    } catch (error) {
      console.warn('[ReactiveStorage] Failed to parse registry:', error)
      return null
    }
  }

  /**
   * Save the query registry to localStorage
   */
  private saveRegistry(registry: QueryRegistry): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(registry))
    } catch (error) {
      console.warn('[ReactiveStorage] Failed to save registry:', error)
      // Handle localStorage quota exceeded
      this.cleanupOldEntries()
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(registry))
      } catch (retryError) {
        console.error(
          '[ReactiveStorage] Failed to save registry after cleanup:',
          retryError
        )
      }
    }
  }

  /**
   * Register a query execution
   */
  registerQuery(
    queryKey: string,
    dependencies: string[],
    data?: any,
    ttl?: number
  ): void {
    const registry = this.getRegistry()
    if (!registry) return

    const now = Date.now()
    registry.queries[queryKey] = {
      lastRevalidated: now,
      lastServerChange: now,
      data,
    }

    // Update session sync time
    registry.session.lastSync = now

    this.saveRegistry(registry)
  }

  /**
   * Mark a query as stale (needs revalidation)
   */
  invalidateQuery(queryKey: string): void {
    const registry = this.getRegistry()
    if (!registry) return

    if (registry.queries[queryKey]) {
      // Keep the data but mark as needing revalidation
      registry.queries[queryKey].lastServerChange = Date.now()
      this.saveRegistry(registry)
    }
  }

  /**
   * Invalidate queries based on table changes
   */
  invalidateByTable(table: string, relations: Record<string, string[]>): void {
    const registry = this.getRegistry()
    if (!registry) return

    const now = Date.now()
    let hasChanges = false

    // Find all queries that depend on this table
    Object.keys(registry.queries).forEach((queryKey) => {
      // Simple heuristic: if query key contains table name or related tables
      const relatedTables = relations[table] || []
      const allTables = [table, ...relatedTables]

      const shouldInvalidate = allTables.some((tableName) =>
        queryKey.toLowerCase().includes(tableName.toLowerCase())
      )

      if (shouldInvalidate) {
        registry.queries[queryKey].lastServerChange = now
        hasChanges = true
      }
    })

    if (hasChanges) {
      registry.session.lastSync = now
      this.saveRegistry(registry)
    }
  }

  /**
   * Get cached data for a query
   */
  getCachedData(queryKey: string): {
    data: any
    isStale: boolean
    lastRevalidated: number
  } | null {
    const registry = this.getRegistry()
    if (!registry) return null

    const queryData = registry.queries[queryKey]
    if (!queryData) return null

    const isStale =
      queryData.lastServerChange !== undefined &&
      queryData.lastServerChange > queryData.lastRevalidated

    return {
      data: queryData.data,
      isStale,
      lastRevalidated: queryData.lastRevalidated,
    }
  }

  /**
   * Detect session gaps and queries that need revalidation
   */
  detectSessionGap(): {
    hasGap: boolean
    gapDuration: number
    staleQueries: string[]
  } {
    const registry = this.getRegistry()
    if (!registry) {
      return { hasGap: true, gapDuration: 0, staleQueries: [] }
    }

    const now = Date.now()
    const gapDuration = now - registry.session.lastSync
    const hasGap = gapDuration > 30000 // 30 seconds threshold

    const staleQueries: string[] = []

    if (hasGap) {
      // All queries are potentially stale after a gap
      Object.keys(registry.queries).forEach((queryKey) => {
        staleQueries.push(queryKey)
      })
    } else {
      // Only queries with server changes are stale
      Object.entries(registry.queries).forEach(([queryKey, queryData]) => {
        if (
          queryData.lastServerChange &&
          queryData.lastServerChange > queryData.lastRevalidated
        ) {
          staleQueries.push(queryKey)
        }
      })
    }

    return { hasGap, gapDuration, staleQueries }
  }

  /**
   * Register an active hook for priority revalidation
   */
  registerActiveHook(
    queryKey: string,
    dependencies: string[],
    organizationId?: string
  ): void {
    this.activeHooks.set(queryKey, {
      queryKey,
      isActive: true,
      lastAccess: Date.now(),
      dependencies,
      organizationId,
    })
  }

  /**
   * Unregister an active hook
   */
  unregisterActiveHook(queryKey: string): void {
    this.activeHooks.delete(queryKey)
  }

  /**
   * Get active hooks for priority revalidation
   */
  getActiveHooks(): HookState[] {
    return Array.from(this.activeHooks.values())
  }

  /**
   * Get active hooks sorted by priority (most recent access first)
   */
  getActiveHooksByPriority(): HookState[] {
    return this.getActiveHooks().sort((a, b) => b.lastAccess - a.lastAccess)
  }

  /**
   * Update real-time connection status
   */
  updateRealtimeStatus(connected: boolean): void {
    const registry = this.getRegistry()
    if (!registry) return

    registry.session.realtimeConnected = connected
    registry.session.lastSync = Date.now()
    this.saveRegistry(registry)
  }

  /**
   * Get queries that should be revalidated first (active hooks)
   */
  getPriorityQueries(): string[] {
    const activeHooks = this.getActiveHooksByPriority()
    return activeHooks.map((hook) => hook.queryKey)
  }

  /**
   * Get background queries that can be revalidated later
   */
  getBackgroundQueries(): string[] {
    const registry = this.getRegistry()
    if (!registry) return []

    const activeQueryKeys = new Set(this.getPriorityQueries())
    return Object.keys(registry.queries).filter(
      (key) => !activeQueryKeys.has(key)
    )
  }

  /**
   * Clean up expired entries to free up localStorage space
   */
  private cleanupExpiredEntries(): void {
    const registry = this.getRegistry()
    if (!registry) return

    const now = Date.now()
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours
    let hasChanges = false

    Object.keys(registry.queries).forEach((queryKey) => {
      const queryData = registry.queries[queryKey]
      if (now - queryData.lastRevalidated > maxAge) {
        delete registry.queries[queryKey]
        hasChanges = true
      }
    })

    if (hasChanges) {
      this.saveRegistry(registry)
    }
  }

  /**
   * Clean up old entries when localStorage is full
   */
  private cleanupOldEntries(): void {
    const registry = this.getRegistry()
    if (!registry) return

    const entries = Object.entries(registry.queries)
    if (entries.length === 0) return

    // Remove oldest 50% of entries
    entries.sort(([, a], [, b]) => a.lastRevalidated - b.lastRevalidated)
    const keepCount = Math.ceil(entries.length / 2)

    const newQueries: Record<string, any> = {}
    entries.slice(-keepCount).forEach(([key, value]) => {
      newQueries[key] = value
    })

    registry.queries = newQueries
    this.saveRegistry(registry)

    console.log(
      `[ReactiveStorage] Cleaned up old entries, keeping ${keepCount} of ${entries.length}`
    )
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Get session information
   */
  getSessionInfo() {
    const registry = this.getRegistry()
    return registry?.session || null
  }

  /**
   * Clear all stored data for this organization
   */
  clearRegistry(): void {
    try {
      localStorage.removeItem(this.storageKey)
    } catch (error) {
      console.warn('[ReactiveStorage] Failed to clear registry:', error)
    }
  }

  /**
   * Export registry for debugging
   */
  exportRegistry(): QueryRegistry | null {
    return this.getRegistry()
  }
}

/**
 * Create a storage instance for an organization
 */
export function createReactiveStorage(organizationId: string): ReactiveStorage {
  return new ReactiveStorage(organizationId)
}
