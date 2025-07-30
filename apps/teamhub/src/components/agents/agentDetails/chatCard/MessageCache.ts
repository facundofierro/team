import { Message } from '@ai-sdk/react'
import type { ToolCall } from '@teamhub/db'

export interface CachedMessage extends Message {
  toolCall?: ToolCall
  lastViewed?: number
  isInViewport?: boolean
  isInDOM?: boolean
}

interface CacheStats {
  totalMessages: number
  inDOMMessages: number
  cachedMessages: number
  memoryUsageEstimate: number // in KB
  lastCleanup: number
}

export class MessageCache {
  private cache = new Map<string, CachedMessage>()
  private viewportBuffer = 10 // Messages to keep above/below viewport
  private maxCacheSize = 200 // Maximum messages to keep in cache
  private maxDOMSize = 100 // Maximum messages to keep in DOM
  private cleanupInterval = 30000 // 30 seconds
  private lastCleanup = Date.now()
  private cleanupTimer?: NodeJS.Timeout

  constructor() {
    this.startCleanupTimer()
  }

  // Add or update message in cache
  public upsertMessage(message: CachedMessage): void {
    const existing = this.cache.get(message.id)
    const updatedMessage: CachedMessage = {
      ...message,
      lastViewed: existing?.lastViewed || Date.now(),
      isInViewport: existing?.isInViewport || false,
      isInDOM: existing?.isInDOM || true,
    }

    this.cache.set(message.id, updatedMessage)
    this.enforceMemoryLimits()
  }

  // Bulk upsert for initial loading
  public upsertMessages(messages: CachedMessage[]): void {
    messages.forEach((message) => {
      const updatedMessage: CachedMessage = {
        ...message,
        lastViewed: Date.now(),
        isInViewport: false,
        isInDOM: true,
      }
      this.cache.set(message.id, updatedMessage)
    })
    this.enforceMemoryLimits()
  }

  // Get messages that should be in DOM (for rendering)
  public getDOMMessages(): CachedMessage[] {
    return Array.from(this.cache.values())
      .filter((msg) => msg.isInDOM)
      .sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return timeA - timeB
      })
  }

  // Get all cached messages (including those not in DOM)
  public getAllMessages(): CachedMessage[] {
    return Array.from(this.cache.values()).sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return timeA - timeB
    })
  }

  // Update viewport status for visible messages
  public updateViewportStatus(visibleMessageIds: string[]): void {
    // Mark all as not in viewport first
    this.cache.forEach((message) => {
      message.isInViewport = false
    })

    // Mark visible ones and update last viewed
    visibleMessageIds.forEach((id) => {
      const message = this.cache.get(id)
      if (message) {
        message.isInViewport = true
        message.lastViewed = Date.now()
      }
    })

    this.optimizeDOMUsage()
  }

  // Smart DOM optimization based on viewport and buffer
  private optimizeDOMUsage(): void {
    const allMessages = this.getAllMessages()
    const visibleMessages = allMessages.filter((msg) => msg.isInViewport)

    if (visibleMessages.length === 0) return

    // Find viewport bounds
    const firstVisibleIndex = allMessages.findIndex((msg) => msg.isInViewport)
    const lastVisibleIndex =
      allMessages.findIndex((msg) => msg.isInViewport) +
      visibleMessages.length -
      1

    // Calculate DOM window with buffer
    const domStartIndex = Math.max(0, firstVisibleIndex - this.viewportBuffer)
    const domEndIndex = Math.min(
      allMessages.length - 1,
      lastVisibleIndex + this.viewportBuffer
    )

    // Update DOM status for all messages
    allMessages.forEach((message, index) => {
      const shouldBeInDOM = index >= domStartIndex && index <= domEndIndex
      message.isInDOM = shouldBeInDOM
    })

    // Ensure we don't exceed max DOM size
    const domMessages = allMessages.filter((msg) => msg.isInDOM)
    if (domMessages.length > this.maxDOMSize) {
      // Keep most recent messages in DOM
      const sortedByTime = domMessages.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return timeB - timeA // Newest first
      })

      sortedByTime.slice(this.maxDOMSize).forEach((message) => {
        message.isInDOM = false
      })
    }
  }

  // Enforce memory limits and cleanup old data
  private enforceMemoryLimits(): void {
    if (this.cache.size <= this.maxCacheSize) return

    const allMessages = Array.from(this.cache.values()).sort(
      (a, b) => (a.lastViewed || 0) - (b.lastViewed || 0)
    ) // Oldest first

    // Remove oldest messages beyond cache limit
    const toRemove = allMessages.slice(0, this.cache.size - this.maxCacheSize)
    toRemove.forEach((message) => {
      this.cache.delete(message.id)
    })
  }

  // Cleanup old messages that haven't been viewed recently
  public cleanup(maxAge: number = 300000): number {
    // 5 minutes default
    const now = Date.now()
    const cutoff = now - maxAge
    let removedCount = 0

    this.cache.forEach((message, id) => {
      if ((message.lastViewed || 0) < cutoff && !message.isInViewport) {
        this.cache.delete(id)
        removedCount++
      }
    })

    this.lastCleanup = now
    return removedCount
  }

  // Get cache statistics for monitoring
  public getStats(): CacheStats {
    const allMessages = Array.from(this.cache.values())
    const domMessages = allMessages.filter((msg) => msg.isInDOM)

    // Rough memory estimation (not perfect but useful)
    const avgMessageSize = 2 // KB estimated per message
    const memoryEstimate = this.cache.size * avgMessageSize

    return {
      totalMessages: allMessages.length,
      inDOMMessages: domMessages.length,
      cachedMessages: this.cache.size,
      memoryUsageEstimate: memoryEstimate,
      lastCleanup: this.lastCleanup,
    }
  }

  // Start automatic cleanup timer
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      const removed = this.cleanup()
      if (process.env.NODE_ENV === 'development' && removed > 0) {
        console.log(`🧹 MessageCache: Cleaned up ${removed} old messages`)
      }
    }, this.cleanupInterval)
  }

  // Stop cleanup timer (for component unmount)
  public destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
    }
    this.cache.clear()
  }

  // Get message by ID from cache
  public getMessage(id: string): CachedMessage | undefined {
    return this.cache.get(id)
  }

  // Check if message should be rendered (is in DOM)
  public shouldRenderMessage(id: string): boolean {
    const message = this.cache.get(id)
    return message?.isInDOM || false
  }

  // Force all messages into DOM (for debugging)
  public forceAllInDOM(): void {
    this.cache.forEach((message) => {
      message.isInDOM = true
    })
  }

  // Get memory usage in human readable format
  public getMemoryUsage(): string {
    const stats = this.getStats()
    if (stats.memoryUsageEstimate < 1024) {
      return `${stats.memoryUsageEstimate}KB`
    }
    return `${(stats.memoryUsageEstimate / 1024).toFixed(1)}MB`
  }
}
