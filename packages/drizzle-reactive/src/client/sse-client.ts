/**
 * Client-side SSE handler for real-time invalidation events
 * Handles automatic reconnection and event acknowledgment
 */

import type { InvalidationEvent } from '../core/types'

export interface SSEClientOptions {
  organizationId: string
  endpoint?: string
  maxReconnectAttempts?: number
  reconnectDelay?: number
  heartbeatTimeout?: number
  onInvalidation?: (event: InvalidationEvent) => void
  onConnectionChange?: (connected: boolean) => void
  onError?: (error: Error) => void
}

export interface SSEClientStats {
  connected: boolean
  connectionAttempts: number
  lastEventTime: number
  eventsReceived: number
  eventsAcknowledged: number
  reconnectAttempts: number
}

export class SSEClient {
  private eventSource: EventSource | null = null
  private options: Required<SSEClientOptions>
  private stats: SSEClientStats
  private reconnectTimer: NodeJS.Timeout | null = null
  private heartbeatTimer: NodeJS.Timeout | null = null
  private isIntentionallyClosed = false

  constructor(options: SSEClientOptions) {
    this.options = {
      endpoint: '/api/events',
      maxReconnectAttempts: 10,
      reconnectDelay: 2000,
      heartbeatTimeout: 90000, // 90 seconds
      onInvalidation: () => {},
      onConnectionChange: () => {},
      onError: () => {},
      ...options,
    }

    this.stats = {
      connected: false,
      connectionAttempts: 0,
      lastEventTime: 0,
      eventsReceived: 0,
      eventsAcknowledged: 0,
      reconnectAttempts: 0,
    }
  }

  /**
   * Connect to the SSE stream
   */
  connect(): void {
    if (this.eventSource) {
      this.disconnect()
    }

    this.isIntentionallyClosed = false
    this.stats.connectionAttempts++

    const url = `${this.options.endpoint}?organizationId=${this.options.organizationId}`

    try {
      console.log(`[SSEClient] Connecting to ${url}`)

      this.eventSource = new EventSource(url)

      this.eventSource.onopen = () => {
        console.log('[SSEClient] Connection opened')
        this.stats.connected = true
        this.stats.reconnectAttempts = 0
        this.options.onConnectionChange(true)
        this.startHeartbeatMonitor()
      }

      this.eventSource.onmessage = (event) => {
        this.handleMessage(event)
      }

      this.eventSource.onerror = (error) => {
        console.warn('[SSEClient] Connection error:', error)
        this.stats.connected = false
        this.options.onConnectionChange(false)
        this.stopHeartbeatMonitor()

        if (!this.isIntentionallyClosed) {
          this.scheduleReconnect()
        }
      }
    } catch (error) {
      console.error('[SSEClient] Failed to create EventSource:', error)
      this.options.onError(error as Error)
      this.scheduleReconnect()
    }
  }

  /**
   * Disconnect from the SSE stream
   */
  disconnect(): void {
    this.isIntentionallyClosed = true
    this.clearReconnectTimer()
    this.stopHeartbeatMonitor()

    if (this.eventSource) {
      console.log('[SSEClient] Disconnecting')
      this.eventSource.close()
      this.eventSource = null
      this.stats.connected = false
      this.options.onConnectionChange(false)
    }
  }

  /**
   * Get connection statistics
   */
  getStats(): SSEClientStats {
    return { ...this.stats }
  }

  /**
   * Check if client is connected
   */
  isConnected(): boolean {
    return this.stats.connected
  }

  /**
   * Handle incoming SSE messages
   */
  private handleMessage(event: MessageEvent): void {
    this.stats.lastEventTime = Date.now()
    this.stats.eventsReceived++

    try {
      const data = JSON.parse(event.data)

      switch (data.type) {
        case 'connected':
          console.log('[SSEClient] Connection confirmed')
          break

        case 'heartbeat':
          console.log('[SSEClient] Heartbeat received')
          this.resetHeartbeatTimer()
          break

        case 'invalidation':
          console.log(
            `[SSEClient] Invalidation received for table: ${data.table}`
          )
          this.handleInvalidationEvent(data as InvalidationEvent)
          break

        default:
          console.log('[SSEClient] Unknown event type:', data.type)
      }
    } catch (error) {
      console.warn('[SSEClient] Failed to parse event data:', error)
      this.options.onError(error as Error)
    }
  }

  /**
   * Handle invalidation events
   */
  private handleInvalidationEvent(event: InvalidationEvent): void {
    // Notify the invalidation handler
    this.options.onInvalidation(event)

    // Send acknowledgment if required
    if (event.requiresAck && event.eventId) {
      this.acknowledgeEvent(event.eventId)
    }
  }

  /**
   * Send event acknowledgment to server
   */
  private async acknowledgeEvent(eventId: string): Promise<void> {
    try {
      const response = await fetch('/api/events/ack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId }),
      })

      if (response.ok) {
        this.stats.eventsAcknowledged++
        console.log(`[SSEClient] Event acknowledged: ${eventId}`)
      } else {
        console.warn(`[SSEClient] Failed to acknowledge event: ${eventId}`)
      }
    } catch (error) {
      console.warn(`[SSEClient] Acknowledgment failed: ${eventId}`, error)
      // Silent fail - server will retry if needed
    }
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.isIntentionallyClosed) return

    if (this.stats.reconnectAttempts >= this.options.maxReconnectAttempts) {
      console.error(
        `[SSEClient] Max reconnect attempts (${this.options.maxReconnectAttempts}) reached`
      )
      this.options.onError(new Error('Max reconnection attempts exceeded'))
      return
    }

    this.clearReconnectTimer()

    const delay = Math.min(
      this.options.reconnectDelay * Math.pow(2, this.stats.reconnectAttempts),
      30000 // Max 30 seconds
    )

    console.log(
      `[SSEClient] Scheduling reconnect in ${delay}ms (attempt ${
        this.stats.reconnectAttempts + 1
      })`
    )

    this.reconnectTimer = setTimeout(() => {
      this.stats.reconnectAttempts++
      this.connect()
    }, delay)
  }

  /**
   * Clear reconnection timer
   */
  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  /**
   * Start heartbeat monitoring
   */
  private startHeartbeatMonitor(): void {
    this.stopHeartbeatMonitor()
    this.resetHeartbeatTimer()
  }

  /**
   * Reset heartbeat timer
   */
  private resetHeartbeatTimer(): void {
    this.stopHeartbeatMonitor()

    this.heartbeatTimer = setTimeout(() => {
      console.warn('[SSEClient] Heartbeat timeout, connection may be stale')

      // Don't automatically disconnect on heartbeat timeout
      // Let the browser's EventSource handle reconnection
      this.stats.connected = false
      this.options.onConnectionChange(false)
    }, this.options.heartbeatTimeout)
  }

  /**
   * Stop heartbeat monitoring
   */
  private stopHeartbeatMonitor(): void {
    if (this.heartbeatTimer) {
      clearTimeout(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }
}

/**
 * Create SSE client for an organization
 */
export function createSSEClient(options: SSEClientOptions): SSEClient {
  return new SSEClient(options)
}
