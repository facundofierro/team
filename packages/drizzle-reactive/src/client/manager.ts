/**
 * Client-side reactive manager
 * Coordinates storage, session recovery, and real-time synchronization
 */

import { ReactiveStorage, createReactiveStorage } from './storage'
import { SessionRecoveryManager, createSessionRecoveryManager } from './session'
import {
  SmartRevalidationEngine,
  createSmartRevalidationEngine,
  type RevalidationOptions,
} from './revalidation'
import { SSEClient, createSSEClient, type SSEClientOptions } from './sse-client'
import type { ReactiveConfig, InvalidationEvent } from '../core/types'

export interface ReactiveManagerOptions {
  organizationId: string
  config: ReactiveConfig
  onInvalidation?: (event: InvalidationEvent) => void
  onRevalidate?: (queryKey: string) => Promise<any>
  sseOptions?: Partial<SSEClientOptions>
}

export class ReactiveClientManager {
  private storage: ReactiveStorage
  private sessionManager: SessionRecoveryManager
  private revalidationEngine: SmartRevalidationEngine
  private sseClient: SSEClient | null = null
  private config: ReactiveConfig
  private organizationId: string
  private onInvalidation?: (event: InvalidationEvent) => void
  private onRevalidate?: (queryKey: string) => Promise<any>

  // Event listeners
  private visibilityListener?: () => void
  private beforeUnloadListener?: () => void

  constructor(options: ReactiveManagerOptions) {
    this.organizationId = options.organizationId
    this.config = options.config
    this.onInvalidation = options.onInvalidation
    this.onRevalidate = options.onRevalidate

    // Initialize storage, session management, and smart revalidation
    this.storage = createReactiveStorage(this.organizationId)
    this.sessionManager = createSessionRecoveryManager(
      this.storage,
      this.config
    )
    this.revalidationEngine = createSmartRevalidationEngine(
      this.storage,
      this.config
    )

    // Set up event listeners
    this.setupEventListeners()

    // Initialize SSE connection if real-time is enabled
    if (this.config.realtime?.enabled !== false) {
      this.initializeSSEConnection(options.sseOptions)
    }

    // Initial session gap check
    this.checkInitialSession()
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
    this.storage.registerQuery(queryKey, dependencies, data, ttl)
  }

  /**
   * Register an active React hook
   */
  registerActiveHook(queryKey: string, dependencies: string[]): () => void {
    this.storage.registerActiveHook(queryKey, dependencies, this.organizationId)

    // Return cleanup function
    return () => {
      this.storage.unregisterActiveHook(queryKey)
    }
  }

  /**
   * Get cached data for a query
   */
  getCachedData(queryKey: string) {
    return this.storage.getCachedData(queryKey)
  }

  /**
   * Handle invalidation event from server
   */
  async handleInvalidation(event: InvalidationEvent): Promise<void> {
    console.log(
      `[ReactiveClient] Received invalidation for table: ${event.table}`
    )

    // Notify listeners first
    if (this.onInvalidation) {
      this.onInvalidation(event)
    }

    // Use smart revalidation engine for intelligent query revalidation
    if (this.onRevalidate) {
      await this.revalidationEngine.smartInvalidateAndRevalidate(
        event.table,
        this.onRevalidate,
        {
          maxConcurrent: 3,
          priorityFirst: true,
          backgroundDelay: 1000,
        }
      )
    } else {
      // Fallback to storage invalidation only
      this.storage.invalidateByTable(event.table, this.config.relations)
    }
  }

  /**
   * Handle real-time connection status changes
   */
  handleConnectionStatus(connected: boolean): void {
    console.log(`[ReactiveClient] Real-time connection: ${connected}`)
    this.storage.updateRealtimeStatus(connected)

    // If reconnected after being offline, check for session gap
    if (connected) {
      this.handleReconnection()
    }
  }

  /**
   * Get current session statistics
   */
  getSessionStats() {
    return {
      storage: this.storage.exportRegistry(),
      recovery: this.sessionManager.getRecoveryStats(),
      activeHooks: this.storage.getActiveHooks().length,
      revalidation: this.revalidationEngine.getRevalidationStats(),
    }
  }

  /**
   * Smart revalidation with priority handling
   */
  async smartRevalidate(
    queries: string[],
    options?: RevalidationOptions
  ): Promise<any> {
    if (!this.onRevalidate) {
      console.warn('[ReactiveClient] No revalidate function provided')
      return
    }

    const strategy = this.revalidationEngine.createRevalidationStrategy(
      queries,
      options
    )

    return await this.revalidationEngine.executeRevalidationStrategy(
      strategy,
      this.onRevalidate,
      options
    )
  }

  /**
   * Queue a query for revalidation with priority
   */
  queueRevalidation(queryKey: string, priority: number = 0): void {
    this.revalidationEngine.queueRevalidation(queryKey, priority)
  }

  /**
   * Process the revalidation queue
   */
  async processRevalidationQueue(options?: RevalidationOptions): Promise<void> {
    if (!this.onRevalidate) {
      console.warn('[ReactiveClient] No revalidate function provided')
      return
    }

    await this.revalidationEngine.processRevalidationQueue(
      this.onRevalidate,
      options
    )
  }

  /**
   * Force manual refresh of all active queries
   */
  async forceRefresh(): Promise<void> {
    console.log('[ReactiveClient] Force refresh initiated')
    await this.sessionManager.forceRecovery(this.revalidateQuery.bind(this))
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    this.removeEventListeners()

    if (this.sseClient) {
      this.sseClient.disconnect()
    }
  }

  /**
   * Initialize SSE connection for real-time updates
   */
  private initializeSSEConnection(
    sseOptions?: Partial<SSEClientOptions>
  ): void {
    console.log('[ReactiveClient] Initializing SSE connection')

    this.sseClient = createSSEClient({
      organizationId: this.organizationId,
      onInvalidation: (event) => this.handleInvalidation(event),
      onConnectionChange: (connected) => this.handleConnectionStatus(connected),
      onError: (error) => {
        console.error('[ReactiveClient] SSE error:', error)
      },
      ...sseOptions,
    })

    // Connect immediately
    this.sseClient.connect()
  }

  /**
   * Get SSE connection statistics
   */
  getSSEStats() {
    return this.sseClient?.getStats() || null
  }

  /**
   * Manually reconnect SSE
   */
  reconnectSSE(): void {
    if (this.sseClient) {
      console.log('[ReactiveClient] Manual SSE reconnection')
      this.sseClient.disconnect()
      setTimeout(() => {
        this.sseClient?.connect()
      }, 1000)
    }
  }

  /**
   * Set up browser event listeners
   */
  private setupEventListeners(): void {
    // Page visibility change (user switches tabs)
    this.visibilityListener = () => {
      if (document.visibilityState === 'visible') {
        this.handleVisibilityChange()
      }
    }
    document.addEventListener('visibilitychange', this.visibilityListener)

    // Before page unload (save state)
    this.beforeUnloadListener = () => {
      // Update last sync time before unload
      const registry = this.storage.getRegistry()
      if (registry) {
        registry.session.lastSync = Date.now()
        this.storage['saveRegistry'](registry)
      }
    }
    window.addEventListener('beforeunload', this.beforeUnloadListener)
  }

  /**
   * Remove event listeners
   */
  private removeEventListeners(): void {
    if (this.visibilityListener) {
      document.removeEventListener('visibilitychange', this.visibilityListener)
    }
    if (this.beforeUnloadListener) {
      window.removeEventListener('beforeunload', this.beforeUnloadListener)
    }
  }

  /**
   * Check for session gap on initial load
   */
  private async checkInitialSession(): Promise<void> {
    const gapInfo = this.sessionManager.analyzeSessionGap()

    if (gapInfo.hasGap) {
      console.log(
        `[ReactiveClient] Initial session gap detected: ${Math.floor(
          gapInfo.gapDuration / 1000
        )}s`
      )

      const plan = this.sessionManager.createRecoveryPlan(gapInfo)
      await this.sessionManager.executeRecovery(
        plan,
        this.revalidateQuery.bind(this)
      )
    } else {
      console.log('[ReactiveClient] No initial session gap')
    }
  }

  /**
   * Handle page visibility change
   */
  private async handleVisibilityChange(): Promise<void> {
    await this.sessionManager.handleVisibilityChange(
      true,
      this.revalidateQuery.bind(this)
    )
  }

  /**
   * Handle real-time reconnection
   */
  private async handleReconnection(): Promise<void> {
    // Small delay to allow SSE to establish
    setTimeout(async () => {
      const gapInfo = this.sessionManager.analyzeSessionGap()
      if (gapInfo.hasGap) {
        console.log(
          `[ReactiveClient] Post-reconnection gap detected: ${Math.floor(
            gapInfo.gapDuration / 1000
          )}s`
        )

        const plan = this.sessionManager.createRecoveryPlan(gapInfo)
        await this.sessionManager.executeRecovery(
          plan,
          this.revalidateQuery.bind(this)
        )
      }
    }, 1000)
  }

  /**
   * Revalidate active queries (high priority)
   */
  private async revalidateActiveQueries(): Promise<void> {
    const priorityQueries = this.storage.getPriorityQueries()

    if (priorityQueries.length === 0) {
      console.log('[ReactiveClient] No active queries to revalidate')
      return
    }

    console.log(
      `[ReactiveClient] Revalidating ${priorityQueries.length} active queries`
    )

    // Revalidate in parallel for active queries
    await Promise.allSettled(
      priorityQueries.map((queryKey) => this.revalidateQuery(queryKey))
    )
  }

  /**
   * Revalidate a specific query
   */
  private async revalidateQuery(queryKey: string): Promise<any> {
    if (this.onRevalidate) {
      try {
        const result = await this.onRevalidate(queryKey)
        console.log(`[ReactiveClient] Revalidated query: ${queryKey}`)
        return result
      } catch (error) {
        console.warn(
          `[ReactiveClient] Failed to revalidate query ${queryKey}:`,
          error
        )
        throw error
      }
    } else {
      console.warn(
        '[ReactiveClient] No revalidate function provided, skipping:',
        queryKey
      )
    }
  }
}

/**
 * Create a reactive client manager
 */
export function createReactiveClient(
  options: ReactiveManagerOptions
): ReactiveClientManager {
  return new ReactiveClientManager(options)
}
