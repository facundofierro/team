/**
 * Session gap detection and recovery system
 * Handles scenarios where the client has been offline or inactive
 */

import type { ReactiveStorage } from './storage'
import type { ReactiveConfig } from '../core/types'

export interface SessionGapInfo {
  hasGap: boolean
  gapDuration: number
  staleQueries: string[]
  missedEvents: number
  recoveryStrategy: 'full' | 'partial' | 'minimal'
}

export interface RecoveryPlan {
  priorityQueries: string[]
  backgroundQueries: string[]
  estimatedTime: number
  strategy: 'full' | 'partial' | 'minimal'
}

export class SessionRecoveryManager {
  private storage: ReactiveStorage
  private config: ReactiveConfig
  private recoveryInProgress = false

  constructor(storage: ReactiveStorage, config: ReactiveConfig) {
    this.storage = storage
    this.config = config
  }

  /**
   * Analyze session gap and determine recovery strategy
   */
  analyzeSessionGap(): SessionGapInfo {
    const gapInfo = this.storage.detectSessionGap()
    const sessionInfo = this.storage.getSessionInfo()

    // Determine recovery strategy based on gap duration
    let recoveryStrategy: SessionGapInfo['recoveryStrategy'] = 'minimal'
    let missedEvents = 0

    if (gapInfo.hasGap) {
      const gapMinutes = gapInfo.gapDuration / (1000 * 60)

      if (gapMinutes > 60) {
        // More than 1 hour gap - full recovery
        recoveryStrategy = 'full'
        missedEvents = Math.floor(gapMinutes / 5) // Estimate 1 event per 5 minutes
      } else if (gapMinutes > 10) {
        // 10-60 minutes gap - partial recovery
        recoveryStrategy = 'partial'
        missedEvents = Math.floor(gapMinutes / 10) // Estimate 1 event per 10 minutes
      } else {
        // Less than 10 minutes - minimal recovery
        recoveryStrategy = 'minimal'
        missedEvents = Math.floor(gapMinutes / 2) // Estimate 1 event per 2 minutes
      }
    }

    return {
      hasGap: gapInfo.hasGap,
      gapDuration: gapInfo.gapDuration,
      staleQueries: gapInfo.staleQueries,
      missedEvents,
      recoveryStrategy,
    }
  }

  /**
   * Create a recovery plan based on session gap analysis
   */
  createRecoveryPlan(gapInfo: SessionGapInfo): RecoveryPlan {
    const priorityQueries = this.storage.getPriorityQueries()
    const backgroundQueries = this.storage.getBackgroundQueries()

    // Filter stale queries based on strategy
    let relevantQueries: string[] = []

    switch (gapInfo.recoveryStrategy) {
      case 'full':
        // Revalidate all queries
        relevantQueries = [...priorityQueries, ...backgroundQueries]
        break
      case 'partial':
        // Revalidate active hooks + some background queries
        relevantQueries = [
          ...priorityQueries,
          ...backgroundQueries.slice(
            0,
            Math.ceil(backgroundQueries.length / 2)
          ),
        ]
        break
      case 'minimal':
        // Only revalidate active hooks
        relevantQueries = priorityQueries
        break
    }

    // Estimate recovery time (100ms per query)
    const estimatedTime = relevantQueries.length * 100

    return {
      priorityQueries: priorityQueries.filter((q) =>
        relevantQueries.includes(q)
      ),
      backgroundQueries: backgroundQueries.filter((q) =>
        relevantQueries.includes(q)
      ),
      estimatedTime,
      strategy: gapInfo.recoveryStrategy,
    }
  }

  /**
   * Execute recovery plan with smart prioritization
   */
  async executeRecovery(
    plan: RecoveryPlan,
    revalidateFn: (queryKey: string) => Promise<any>
  ): Promise<{
    success: boolean
    revalidatedCount: number
    failedCount: number
    duration: number
  }> {
    if (this.recoveryInProgress) {
      console.log('[SessionRecovery] Recovery already in progress, skipping')
      return {
        success: false,
        revalidatedCount: 0,
        failedCount: 0,
        duration: 0,
      }
    }

    this.recoveryInProgress = true
    const startTime = Date.now()
    let revalidatedCount = 0
    let failedCount = 0

    try {
      console.log(
        `[SessionRecovery] Starting ${plan.strategy} recovery for ${
          plan.priorityQueries.length + plan.backgroundQueries.length
        } queries`
      )

      // Phase 1: Revalidate priority queries (active hooks) first
      if (plan.priorityQueries.length > 0) {
        console.log(
          `[SessionRecovery] Phase 1: Revalidating ${plan.priorityQueries.length} priority queries`
        )

        const priorityResults = await Promise.allSettled(
          plan.priorityQueries.map(async (queryKey) => {
            try {
              await revalidateFn(queryKey)
              return { success: true, queryKey }
            } catch (error) {
              console.warn(
                `[SessionRecovery] Failed to revalidate priority query ${queryKey}:`,
                error
              )
              throw error
            }
          })
        )

        priorityResults.forEach((result) => {
          if (result.status === 'fulfilled') {
            revalidatedCount++
          } else {
            failedCount++
          }
        })
      }

      // Phase 2: Background revalidation with delays
      if (plan.backgroundQueries.length > 0) {
        console.log(
          `[SessionRecovery] Phase 2: Revalidating ${plan.backgroundQueries.length} background queries`
        )

        // Revalidate background queries with staggered delays
        setTimeout(() => {
          this.revalidateBackgroundQueries(plan.backgroundQueries, revalidateFn)
        }, 2000) // 2 second delay
      }

      const duration = Date.now() - startTime

      console.log(
        `[SessionRecovery] Recovery completed: ${revalidatedCount} successful, ${failedCount} failed (${duration}ms)`
      )

      return {
        success: failedCount === 0,
        revalidatedCount,
        failedCount,
        duration,
      }
    } finally {
      this.recoveryInProgress = false
    }
  }

  /**
   * Revalidate background queries with rate limiting
   */
  private async revalidateBackgroundQueries(
    queries: string[],
    revalidateFn: (queryKey: string) => Promise<any>
  ): Promise<void> {
    console.log(
      `[SessionRecovery] Starting background revalidation for ${queries.length} queries`
    )

    // Process in batches of 3 with 500ms delay between batches
    const batchSize = 3
    const batchDelay = 500

    for (let i = 0; i < queries.length; i += batchSize) {
      const batch = queries.slice(i, i + batchSize)

      try {
        await Promise.allSettled(
          batch.map(async (queryKey) => {
            try {
              await revalidateFn(queryKey)
              console.log(
                `[SessionRecovery] Background revalidated: ${queryKey}`
              )
            } catch (error) {
              console.warn(
                `[SessionRecovery] Background revalidation failed for ${queryKey}:`,
                error
              )
            }
          })
        )
      } catch (error) {
        console.warn('[SessionRecovery] Batch revalidation error:', error)
      }

      // Delay between batches to avoid overwhelming the server
      if (i + batchSize < queries.length) {
        await new Promise((resolve) => setTimeout(resolve, batchDelay))
      }
    }

    console.log('[SessionRecovery] Background revalidation completed')
  }

  /**
   * Handle page visibility change (user returning to tab)
   */
  async handleVisibilityChange(
    isVisible: boolean,
    revalidateFn: (queryKey: string) => Promise<any>
  ): Promise<void> {
    if (!isVisible) {
      console.log('[SessionRecovery] Page hidden, pausing recovery')
      return
    }

    console.log('[SessionRecovery] Page visible, checking for session gap')

    const gapInfo = this.analyzeSessionGap()
    if (gapInfo.hasGap) {
      console.log(
        `[SessionRecovery] Detected session gap of ${Math.floor(
          gapInfo.gapDuration / 1000
        )}s, initiating recovery`
      )

      const plan = this.createRecoveryPlan(gapInfo)
      await this.executeRecovery(plan, revalidateFn)
    } else {
      console.log('[SessionRecovery] No session gap detected')
    }
  }

  /**
   * Get recovery statistics
   */
  getRecoveryStats(): {
    isRecovering: boolean
    lastGapInfo: SessionGapInfo | null
    sessionInfo: any
  } {
    const gapInfo = this.analyzeSessionGap()
    const sessionInfo = this.storage.getSessionInfo()

    return {
      isRecovering: this.recoveryInProgress,
      lastGapInfo: gapInfo.hasGap ? gapInfo : null,
      sessionInfo,
    }
  }

  /**
   * Force a manual recovery (for debugging or user-triggered refresh)
   */
  async forceRecovery(
    revalidateFn: (queryKey: string) => Promise<any>
  ): Promise<void> {
    console.log('[SessionRecovery] Force recovery initiated')

    const priorityQueries = this.storage.getPriorityQueries()
    const plan: RecoveryPlan = {
      priorityQueries,
      backgroundQueries: [],
      estimatedTime: priorityQueries.length * 100,
      strategy: 'minimal',
    }

    await this.executeRecovery(plan, revalidateFn)
  }
}

/**
 * Create a session recovery manager
 */
export function createSessionRecoveryManager(
  storage: ReactiveStorage,
  config: ReactiveConfig
): SessionRecoveryManager {
  return new SessionRecoveryManager(storage, config)
}
