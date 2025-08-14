import { Message } from '@ai-sdk/react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Brain, AlertTriangle, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ToolCallIndicator } from './ToolCallIndicator'
import { MessageContent } from './MessageContent'
import { MessagePagination } from './MessagePagination'
import { MessageCache, type CachedMessage } from './MessageCache'
import {
  PerformanceMonitor,
  type PerformanceWarning,
} from './PerformanceMonitor'
import { useMemo, useState, useCallback, useEffect, useRef, memo } from 'react'
import type { ToolCall } from '@teamhub/db'

interface ToolCallMessage extends Message {
  toolCall?: ToolCall
}

type ConversationAreaProps = {
  messages: Message[]
  toolCallMessages: (Message & { toolCall?: ToolCall })[]
  isLoading: boolean
}

// Memoized Message Component to prevent unnecessary re-renders
const MemoizedMessageItem = memo(
  ({
    message,
    className,
    isStreaming = false,
  }: {
    message: Message & { toolCall?: ToolCall }
    className?: string
    isStreaming?: boolean
  }) => {
    if (message.role === 'system' && message.toolCall) {
      return (
        <div
          key={message.id}
          className="p-4 rounded-lg max-w-[80%] break-words bg-blue-50 border border-blue-200"
        >
          <ToolCallIndicator toolCalls={[message.toolCall]} />
        </div>
      )
    }

    // Regular message rendering
    return (
      <div
        key={message.id}
        className={cn(
          'p-4 rounded-lg max-w-[80%] break-words',
          message.role === 'user'
            ? 'bg-gray-100/60 ml-auto text-orange-600 font-medium'
            : 'bg-gray-100/40 text-gray-900',
          className
        )}
      >
        <MessageContent
          message={message as ToolCallMessage}
          isUser={message.role === 'user'}
          isStreaming={isStreaming && message.role === 'assistant'}
        />
      </div>
    )
  },
  (prevProps, nextProps) => {
    // Custom comparison to prevent unnecessary re-renders
    return (
      prevProps.message.id === nextProps.message.id &&
      prevProps.message.content === nextProps.message.content &&
      prevProps.message.role === nextProps.message.role &&
      prevProps.className === nextProps.className &&
      prevProps.isStreaming === nextProps.isStreaming &&
      // Compare tool call if present
      JSON.stringify(prevProps.message.toolCall) ===
        JSON.stringify(nextProps.message.toolCall)
    )
  }
)

MemoizedMessageItem.displayName = 'MemoizedMessageItem'

// Enhanced pagination settings with smart loading
const DEFAULT_VISIBLE_MESSAGES = 50 // Production setting - good for most conversations
const STREAMING_VISIBLE_MESSAGES = 30 // Production setting - optimal streaming performance
const LOAD_MORE_BATCH_SIZE = 25 // Production setting - good UX balance
const SCROLL_THRESHOLD = 100 // Pixels from top to trigger auto-load
const PREFETCH_THRESHOLD = 0.7 // Load more when 70% through current batch
const MAX_PREFETCH_BATCHES = 2 // Maximum batches to prefetch ahead

export const ConversationArea = memo(function ConversationArea({
  messages,
  toolCallMessages,
  isLoading,
}: ConversationAreaProps) {
  // Enhanced pagination state
  const [visibleMessageCount, setVisibleMessageCount] = useState(
    DEFAULT_VISIBLE_MESSAGES
  )
  const [isStreamingMode, setIsStreamingMode] = useState(false)
  const [shouldMaintainScroll, setShouldMaintainScroll] = useState(false)
  const [isPrefetching, setIsPrefetching] = useState(false)
  const [lastScrollTop, setLastScrollTop] = useState(0)
  const [isNearTop, setIsNearTop] = useState(false)

  // Memory management state
  const messageCacheRef = useRef<MessageCache>()
  const [memoryStats, setMemoryStats] = useState({
    totalMessages: 0,
    inDOMMessages: 0,
    memoryUsage: '0KB',
  })

  // Refs for scroll management
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const scrollThrottleRef = useRef<NodeJS.Timeout>()
  const prefetchTimeoutRef = useRef<NodeJS.Timeout>()
  const viewportObserverRef = useRef<IntersectionObserver>()

  // Initialize message cache
  useEffect(() => {
    if (!messageCacheRef.current) {
      messageCacheRef.current = new MessageCache()
    }

    return () => {
      messageCacheRef.current?.destroy()
    }
  }, [])

  // Detect streaming mode based on isLoading state
  useEffect(() => {
    if (isLoading && !isStreamingMode) {
      // Entering streaming mode - reduce visible messages for performance
      setIsStreamingMode(true)
      setVisibleMessageCount(STREAMING_VISIBLE_MESSAGES)
    } else if (!isLoading && isStreamingMode) {
      // Exiting streaming mode - restore normal pagination
      setIsStreamingMode(false)
      setVisibleMessageCount(DEFAULT_VISIBLE_MESSAGES)
    }
  }, [isLoading, isStreamingMode])

  // Memoized message sorting and caching - only recalculate when messages change
  const sortedMessages = useMemo(() => {
    const allMessages = [...messages, ...toolCallMessages]

    const sorted = allMessages.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0

      // If timestamps are very close (within 2 seconds), enforce logical order
      if (Math.abs(timeA - timeB) < 2000) {
        // Tool calls (system messages) should come before assistant responses
        if (a.role === 'system' && b.role === 'assistant') return -1
        if (a.role === 'assistant' && b.role === 'system') return 1
        // User messages should come before everything else
        if (
          a.role === 'user' &&
          (b.role === 'system' || b.role === 'assistant')
        )
          return -1
        if (
          (a.role === 'system' || a.role === 'assistant') &&
          b.role === 'user'
        )
          return 1
      }

      return timeA - timeB
    })

    // Update message cache with sorted messages
    if (messageCacheRef.current) {
      const cachedMessages: CachedMessage[] = sorted.map((msg) => ({
        ...msg,
        toolCall: (msg as any).toolCall,
      }))
      messageCacheRef.current.upsertMessages(cachedMessages)
    }

    return sorted
  }, [messages, toolCallMessages])

  // Enhanced visible messages calculation with memory management
  const { visibleMessages, hasMoreMessages, hiddenMessageCount, canPrefetch } =
    useMemo(() => {
      if (!messageCacheRef.current) {
        // Fallback if cache not ready
        const totalMessages = sortedMessages.length
        const hasMore = totalMessages > visibleMessageCount
        const startIndex = Math.max(0, totalMessages - visibleMessageCount)
        const visible = sortedMessages.slice(startIndex)
        const hiddenCount = Math.max(0, totalMessages - visibleMessageCount)

        return {
          visibleMessages: visible,
          hasMoreMessages: hasMore,
          hiddenMessageCount: hiddenCount,
          canPrefetch: false,
        }
      }

      // Use cached messages with smart DOM management
      const allCachedMessages = messageCacheRef.current.getAllMessages()
      const totalMessages = allCachedMessages.length
      const hasMore = totalMessages > visibleMessageCount

      // Get messages that should be visible based on pagination
      const startIndex = Math.max(0, totalMessages - visibleMessageCount)
      const paginatedMessages = allCachedMessages.slice(startIndex)

      // Get only messages that should be in DOM (memory optimized)
      const domMessages = messageCacheRef.current.getDOMMessages()
      const visibleDOMMessages = domMessages.filter((msg) =>
        paginatedMessages.some((pMsg) => pMsg.id === msg.id)
      )

      const hiddenCount = Math.max(0, totalMessages - visibleMessageCount)

      // Calculate if we should prefetch
      const prefetchTrigger = visibleMessageCount * PREFETCH_THRESHOLD
      const shouldPrefetch =
        hasMore &&
        paginatedMessages.length >= prefetchTrigger &&
        hiddenCount > 0

      // Update memory stats
      const stats = messageCacheRef.current.getStats()
      setMemoryStats({
        totalMessages: stats.totalMessages,
        inDOMMessages: stats.inDOMMessages,
        memoryUsage: messageCacheRef.current.getMemoryUsage(),
      })

      return {
        visibleMessages:
          visibleDOMMessages.length > 0
            ? visibleDOMMessages
            : paginatedMessages,
        hasMoreMessages: hasMore,
        hiddenMessageCount: hiddenCount,
        canPrefetch: shouldPrefetch,
      }
    }, [sortedMessages, visibleMessageCount])

  // Enhanced load more handler with memory management
  const handleLoadMore = useCallback(
    (batchSize?: number) => {
      const scrollElement = scrollAreaRef.current?.querySelector(
        '[data-radix-scroll-area-viewport]'
      )
      const currentScrollHeight = scrollElement?.scrollHeight || 0

      setShouldMaintainScroll(true)

      // Intelligent batch size calculation
      const adaptiveBatchSize =
        batchSize ||
        (() => {
          const remaining = hiddenMessageCount
          if (remaining <= 10) return remaining // Load all remaining if few left
          if (remaining <= 50) return Math.min(LOAD_MORE_BATCH_SIZE, remaining)
          return LOAD_MORE_BATCH_SIZE // Standard batch size for large conversations
        })()

      setVisibleMessageCount((prev) => {
        const newCount = Math.min(
          prev + adaptiveBatchSize,
          sortedMessages.length
        )

        // Update cache with new visible range
        if (messageCacheRef.current) {
          const allMessages = messageCacheRef.current.getAllMessages()
          const startIndex = Math.max(0, allMessages.length - newCount)
          const newVisibleIds = allMessages
            .slice(startIndex)
            .map((msg) => msg.id)
          messageCacheRef.current.updateViewportStatus(newVisibleIds)
        }

        return newCount
      })

      // Enhanced scroll position maintenance
      setTimeout(() => {
        if (scrollElement) {
          const newScrollHeight = scrollElement.scrollHeight
          const scrollDiff = newScrollHeight - currentScrollHeight
          scrollElement.scrollTop = scrollElement.scrollTop + scrollDiff

          // Additional stability check
          requestAnimationFrame(() => {
            if (scrollElement.scrollTop < scrollDiff * 0.9) {
              scrollElement.scrollTop = scrollElement.scrollTop + scrollDiff
            }
          })
        }
        setShouldMaintainScroll(false)
      }, 0)
    },
    [hiddenMessageCount, sortedMessages.length]
  )

  // Smart prefetching logic with memory awareness
  const handlePrefetch = useCallback(() => {
    if (isPrefetching || !canPrefetch || isStreamingMode) return

    setIsPrefetching(true)

    // Prefetch in smaller chunks to avoid UI blocking
    const prefetchSize = Math.min(LOAD_MORE_BATCH_SIZE / 2, hiddenMessageCount)

    if (prefetchTimeoutRef.current) {
      clearTimeout(prefetchTimeoutRef.current)
    }

    prefetchTimeoutRef.current = setTimeout(() => {
      handleLoadMore(prefetchSize)
      setIsPrefetching(false)
    }, 150) // Debounced prefetch
  }, [
    isPrefetching,
    canPrefetch,
    isStreamingMode,
    hiddenMessageCount,
    handleLoadMore,
  ])

  // Enhanced scroll handling with memory optimization
  const handleScroll = useCallback(
    (event: Event) => {
      const scrollElement = event.target as HTMLElement
      const scrollTop = scrollElement.scrollTop
      const scrollHeight = scrollElement.scrollHeight
      const clientHeight = scrollElement.clientHeight

      setLastScrollTop(scrollTop)

      // Check if near top for auto-loading
      const nearTop = scrollTop < SCROLL_THRESHOLD
      setIsNearTop(nearTop)

      // Update viewport status for memory management
      if (messageCacheRef.current) {
        // Find visible message elements and update cache
        const messageElements =
          scrollElement.querySelectorAll('[data-message-id]')
        const visibleIds: string[] = []

        messageElements.forEach((element) => {
          const rect = element.getBoundingClientRect()
          const containerRect = scrollElement.getBoundingClientRect()

          // Check if element is visible in viewport
          if (
            rect.bottom >= containerRect.top &&
            rect.top <= containerRect.bottom
          ) {
            const messageId = element.getAttribute('data-message-id')
            if (messageId) visibleIds.push(messageId)
          }
        })

        messageCacheRef.current.updateViewportStatus(visibleIds)
      }

      // Throttled scroll handling
      if (scrollThrottleRef.current) {
        clearTimeout(scrollThrottleRef.current)
      }

      scrollThrottleRef.current = setTimeout(() => {
        // Auto-load when scrolling near top (user wants to see older messages)
        if (nearTop && hasMoreMessages && !isLoading && !shouldMaintainScroll) {
          handleLoadMore()
        }

        // Trigger prefetch when scrolling up through current batch
        if (scrollTop < clientHeight && canPrefetch && !isStreamingMode) {
          handlePrefetch()
        }
      }, 100) // Throttle scroll events
    },
    [
      hasMoreMessages,
      isLoading,
      shouldMaintainScroll,
      handleLoadMore,
      canPrefetch,
      isStreamingMode,
      handlePrefetch,
    ]
  )

  // Attach scroll listener with memory optimization
  useEffect(() => {
    const scrollElement = scrollAreaRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    )
    if (!scrollElement) return

    scrollElement.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll)
      if (scrollThrottleRef.current) {
        clearTimeout(scrollThrottleRef.current)
      }
      if (prefetchTimeoutRef.current) {
        clearTimeout(prefetchTimeoutRef.current)
      }
    }
  }, [handleScroll])

  // Auto-scroll to bottom for new messages (enhanced logic)
  useEffect(() => {
    if (!shouldMaintainScroll && !isStreamingMode && !isNearTop) {
      const scrollElement = scrollAreaRef.current?.querySelector(
        '[data-radix-scroll-area-viewport]'
      )
      if (scrollElement) {
        // Smooth scroll to bottom for new messages
        const isAtBottom =
          scrollElement.scrollTop + scrollElement.clientHeight >=
          scrollElement.scrollHeight - 50

        if (isAtBottom || visibleMessages.length <= DEFAULT_VISIBLE_MESSAGES) {
          scrollElement.scrollTop = scrollElement.scrollHeight
        }
      }
    }
  }, [visibleMessages.length, shouldMaintainScroll, isStreamingMode, isNearTop])

  return (
    <ScrollArea ref={scrollAreaRef} className="flex-1 min-h-0 px-4">
      <div className="py-4 space-y-4">
        {/* Enhanced Message Pagination Component */}
        <MessagePagination
          hasMoreMessages={hasMoreMessages}
          hiddenMessageCount={hiddenMessageCount}
          visibleMessageCount={visibleMessages.length}
          totalMessageCount={sortedMessages.length}
          isStreamingMode={isStreamingMode}
          isLoading={isLoading}
          batchSize={LOAD_MORE_BATCH_SIZE}
          onLoadMore={() => handleLoadMore()}
        />

        {/* Smart loading indicator */}
        {isPrefetching && (
          <div className="flex justify-center">
            <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
              🧠 Smart loading...
            </div>
          </div>
        )}

        {/* Render visible messages with memory optimization */}
        {visibleMessages.map((message: Message & { toolCall?: ToolCall }) => (
          <div key={message.id} data-message-id={message.id}>
            <MemoizedMessageItem message={message} isStreaming={isLoading} />
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="p-4 rounded-lg max-w-[80%] break-words bg-gray-100/40 text-gray-900">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 animate-pulse text-orange-500" />
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced performance and memory info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">
            <div>
              📊 Performance: {visibleMessages.length}/{sortedMessages.length}{' '}
              messages visible
            </div>
            <div>
              🧠 Memory: {memoryStats.inDOMMessages}/{memoryStats.totalMessages}{' '}
              in DOM ({memoryStats.memoryUsage})
            </div>
            <div>
              🔧 Tool calls: {toolCallMessages.length} tool messages received
              from ChatCard
            </div>
            <div>
              🔧 System messages with toolCall:{' '}
              {
                visibleMessages.filter(
                  (msg) => msg.role === 'system' && (msg as any).toolCall
                ).length
              }
            </div>
            <div className="flex gap-2 mt-1">
              {isStreamingMode && (
                <span className="bg-orange-100 px-1 rounded">
                  Streaming Mode
                </span>
              )}
              {isPrefetching && (
                <span className="bg-blue-100 px-1 rounded">Prefetching</span>
              )}
              {isNearTop && (
                <span className="bg-gray-100 px-1 rounded">Near Top</span>
              )}
              {canPrefetch && (
                <span className="bg-green-100 px-1 rounded">Can Prefetch</span>
              )}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  )
})

ConversationArea.displayName = 'ConversationArea'
